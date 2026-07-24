// Express server: serves the built SPA, persists uploaded documents to disk,
// and stores app data (people + settings) in a JSON file on a mounted volume.
import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 6900;
const DATA_DIR = process.env.DATA_DIR || "/data";
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(DATA_DIR, "uploads");
const DB_FILE = process.env.DB_FILE || path.join(DATA_DIR, "db.json");
const DIST_DIR = process.env.DIST_DIR || path.resolve(__dirname, "../dist");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

const DEFAULT_DB = {
  people: [],
  settings: {
    systemName: "Active Orders of Protection",
    disclaimerText:
      "This system contains sensitive law enforcement information. Access is restricted to authorized personnel only. All activities are logged and monitored. Unauthorized access is prohibited and subject to prosecution.",
    logoUrl: "",
  },
  auditLogs: [],
};

async function readDb() {
  try {
    const raw = await fsp.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DB, ...parsed, settings: { ...DEFAULT_DB.settings, ...(parsed.settings || {}) } };
  } catch {
    return structuredClone(DEFAULT_DB);
  }
}

// Atomic write: write to a temp file, then rename.
let writeChain = Promise.resolve();
function writeDb(next) {
  writeChain = writeChain.then(async () => {
    const tmp = `${DB_FILE}.tmp-${process.pid}-${Date.now()}`;
    await fsp.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
    await fsp.rename(tmp, DB_FILE);
  });
  return writeChain;
}

const app = express();
app.use(express.json({ limit: "10mb" }));

// ---------- File uploads ----------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const safe = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${safe}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({
    name: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

// ---------- Persistent data ----------
app.get("/api/data", async (_req, res) => {
  res.json(await readDb());
});

app.put("/api/data", async (req, res) => {
  const body = req.body || {};
  const current = await readDb();
  const next = {
    people: Array.isArray(body.people) ? body.people : current.people,
    settings: { ...current.settings, ...(body.settings || {}) },
    auditLogs: Array.isArray(body.auditLogs) ? body.auditLogs : current.auditLogs,
  };
  await writeDb(next);
  res.json({ ok: true });
});

app.get("/api/people", async (_req, res) => res.json((await readDb()).people));
app.put("/api/people", async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: "Expected array" });
  const db = await readDb();
  db.people = req.body;
  await writeDb(db);
  res.json({ ok: true, count: db.people.length });
});

app.get("/api/settings", async (_req, res) => res.json((await readDb()).settings));
app.put("/api/settings", async (req, res) => {
  const db = await readDb();
  db.settings = { ...db.settings, ...(req.body || {}) };
  await writeDb(db);
  res.json(db.settings);
});

// ---------- Static assets ----------
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    fallthrough: false,
    maxAge: "1y",
    setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
  })
);

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: "1h" }));
  app.get("/{*splat}", (_req, res) => res.sendFile(path.join(DIST_DIR, "index.html")));
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[server] listening on http://0.0.0.0:${PORT}`);
  console.log(`[server] data dir:    ${DATA_DIR}`);
  console.log(`[server] uploads dir: ${UPLOAD_DIR}`);
  console.log(`[server] db file:     ${DB_FILE}`);
  console.log(`[server] dist dir:    ${DIST_DIR}`);
});
