// Tiny Express server that serves the built SPA and persists uploaded
// documents to disk. Designed to run inside the Docker container.
import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 6900;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/data/uploads";
const DIST_DIR = process.env.DIST_DIR || path.resolve(__dirname, "../dist");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();

// Multer storage – keep original extension, randomize basename.
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const safe = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${safe}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

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

// Serve persisted uploads.
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    fallthrough: false,
    maxAge: "1y",
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

// Serve built SPA (if present) with history fallback.
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: "1h" }));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[server] listening on http://0.0.0.0:${PORT}`);
  console.log(`[server] uploads dir: ${UPLOAD_DIR}`);
  console.log(`[server] dist dir:    ${DIST_DIR}`);
});
