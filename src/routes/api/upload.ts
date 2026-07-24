import { createFileRoute } from "@tanstack/react-router";
import { saveUpload, guessMime } from "./_storage";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const form = await request.formData();
          const value = form.get("file");
          if (!value || typeof value === "string" || typeof (value as Blob).arrayBuffer !== "function") {
            return Response.json({ error: "No valid file was received." }, { status: 400 });
          }

          const file = value as File;
          const type = file.type || guessMime(file.name || "upload");
          if (!ALLOWED_TYPES.has(type)) {
            return Response.json({ error: "Unsupported file type. Use JPG, PNG, WebP, GIF, PDF, or DOCX." }, { status: 415 });
          }
          if (file.size <= 0) return Response.json({ error: "The selected file is empty." }, { status: 400 });
          if (file.size > MAX_UPLOAD_BYTES) return Response.json({ error: "The file is larger than 15 MB." }, { status: 413 });

          const buf = new Uint8Array(await file.arrayBuffer());
          const url = await saveUpload(file.name || "upload", buf);
          return Response.json({ name: file.name || "upload", url, type });
        } catch (error) {
          console.error("Upload failed", error);
          return Response.json({ error: "The server could not save the upload." }, { status: 500 });
        }
      },
    },
  },
});
