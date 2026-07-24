import { createFileRoute } from "@tanstack/react-router";
import { readDb } from "./_storage";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = await readDb();
          return Response.json({ status: "ok", database: "reachable", records: db.people.length, time: new Date().toISOString() }, { status: 200 });
        } catch (error) {
          console.error("Health check failed", error);
          return Response.json({ status: "error", database: "unreachable", time: new Date().toISOString() }, { status: 503 });
        }
      },
    },
  },
});
