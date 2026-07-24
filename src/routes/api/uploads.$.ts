import { createFileRoute } from "@tanstack/react-router";
import { readUpload, guessMime } from "./_storage";

export const Route = createFileRoute("/api/uploads/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const routeParams = params as Record<string, string | undefined>;
        const rest = routeParams._splat || routeParams["$"] || "";
        const name = decodeURIComponent(rest.split("/").pop() || "");
        if (!name) return new Response("Not found", { status: 404 });

        const bytes = await readUpload(name);
        if (!bytes) return new Response("Not found", { status: 404 });
        const body = bytes.slice().buffer;
        return new Response(body, {
          headers: {
            "content-type": guessMime(name),
            "content-length": String(bytes.byteLength),
            "content-disposition": `inline; filename="${name.replace(/["\\r\\n]/g, "_")}"`,
            "cache-control": "private, max-age=3600",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});
