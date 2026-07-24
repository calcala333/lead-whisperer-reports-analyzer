import { createFileRoute } from "@tanstack/react-router";
import { updateDb } from "./-_storage";

export const Route = createFileRoute("/api/people")({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        const body = await request.json();
        if (!Array.isArray(body)) {
          return new Response("Expected array", { status: 400 });
        }
        await updateDb((db) => {
          db.people = body;
        });
        return Response.json({ ok: true, count: body.length });
      },
    },
  },
});