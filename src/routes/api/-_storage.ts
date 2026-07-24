import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const DATA_DIR = process.env.DATA_DIR || resolve(process.cwd(), "data");
const UPLOADS_DIR = join(DATA_DIR, "uploads");
const DB_FILE = join(DATA_DIR, "db.json");

export type DbShape = {
  people: unknown[];
  settings: Record<string, string>;
};

const DEFAULT_DB: DbShape = { people: [], settings: {} };

// Serialize writes so simultaneous record/settings updates cannot overwrite one another.
let writeQueue: Promise<void> = Promise.resolve();

async function ensureDirs() {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  if (!existsSync(UPLOADS_DIR)) await mkdir(UPLOADS_DIR, { recursive: true });
}

export async function readDb(): Promise<DbShape> {
  await ensureDirs();
  if (!existsSync(DB_FILE)) return { ...DEFAULT_DB };
  try {
    const raw = await readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    return {
      people: Array.isArray(parsed.people) ? parsed.people : [],
      settings: parsed.settings && typeof parsed.settings === "object" ? parsed.settings : {},
    };
  } catch {
    return { ...DEFAULT_DB };
  }
}

export async function writeDb(db: DbShape): Promise<void> {
  const operation = async () => {
    await ensureDirs();
    const tmp = DB_FILE + ".tmp";
    await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    const { rename } = await import("node:fs/promises");
    await rename(tmp, DB_FILE);
  };

  writeQueue = writeQueue.then(operation, operation);
  return writeQueue;
}

export async function updateDb(mutator: (db: DbShape) => void): Promise<DbShape> {
  let updated: DbShape = { ...DEFAULT_DB };
  const operation = async () => {
    const db = await readDb();
    mutator(db);
    await ensureDirs();
    const tmp = DB_FILE + ".tmp";
    await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    const { rename } = await import("node:fs/promises");
    await rename(tmp, DB_FILE);
    updated = db;
  };

  writeQueue = writeQueue.then(operation, operation);
  await writeQueue;
  return updated;
}

export async function saveUpload(filename: string, bytes: Uint8Array): Promise<string> {
  await ensureDirs();
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const stamped = `${Date.now()}_${safe}`;
  const outPath = join(UPLOADS_DIR, stamped);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, bytes);
  return `/api/uploads/${encodeURIComponent(stamped)}`;
}

export async function readUpload(name: string): Promise<Uint8Array | null> {
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const p = join(UPLOADS_DIR, safe);
  if (!existsSync(p)) return null;
  return new Uint8Array(await readFile(p));
}

export function guessMime(name: string): string {
  const ext = name.toLowerCase().split(".").pop() || "";
  const map: Record<string, string> = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
    bmp: "image/bmp",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    txt: "text/plain",
    json: "application/json",
  };
  return map[ext] || "application/octet-stream";
}