import { createFileRoute } from "@tanstack/react-router";
import { readDb } from "./-_storage";

export const Route = createFileRoute("/api/data")({
  server: {
    handlers: {
      GET: async () => {
        const db = await readDb();
        return Response.json(db);
      },
    },
  },
});