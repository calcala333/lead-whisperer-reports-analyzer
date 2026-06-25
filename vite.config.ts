import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// In dev, run the upload server with: `node server/server.mjs` (defaults to :6900).
// To avoid colliding with Vite, set PORT=6901 when running it locally and
// the proxy below will forward /api and /uploads to it.
const UPLOAD_API = process.env.VITE_UPLOAD_API || "http://localhost:6901";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 6900,
    proxy: {
      "/api": { target: UPLOAD_API, changeOrigin: true },
      "/uploads": { target: UPLOAD_API, changeOrigin: true },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
