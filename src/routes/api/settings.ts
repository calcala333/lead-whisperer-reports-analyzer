import { createFileRoute } from "@tanstack/react-router";
import { updateDb } from "./-_storage";

export const Route = createFileRoute("/api/settings")({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        const body = (await request.json()) as Record<string, string>;
        if (!body || typeof body !== "object") {
          return new Response("Expected object", { status: 400 });
        }
        await updateDb((db) => {
          db.settings = { ...db.settings, ...body };
        });
        return Response.json({ ok: true });
      },
    },
  },
});