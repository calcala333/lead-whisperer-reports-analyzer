import { createFileRoute } from "@tanstack/react-router";

interface CensusMatch {
  matchedAddress?: string;
  coordinates?: { x?: number; y?: number };
}

export const Route = createFileRoute("/api/address-search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const query = requestUrl.searchParams.get("q")?.trim() ?? "";

        if (query.length < 6 || query.length > 200) {
          return Response.json({ matches: [] }, { status: 200 });
        }

        const censusUrl = new URL(
          "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress",
        );
        censusUrl.searchParams.set("address", query);
        censusUrl.searchParams.set("benchmark", "Public_AR_Current");
        censusUrl.searchParams.set("format", "json");

        try {
          const response = await fetch(censusUrl, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(7000),
          });

          if (!response.ok) {
            throw new Error(`Census geocoder returned ${response.status}`);
          }

          const data = (await response.json()) as {
            result?: { addressMatches?: CensusMatch[] };
          };

          const matches = (data.result?.addressMatches ?? [])
            .filter((match) => Boolean(match.matchedAddress))
            .slice(0, 8)
            .map((match) => ({
              address: match.matchedAddress!,
              coordinates:
                typeof match.coordinates?.y === "number" && typeof match.coordinates?.x === "number"
                  ? { latitude: match.coordinates.y, longitude: match.coordinates.x }
                  : undefined,
            }));

          return Response.json(
            { matches, provider: "U.S. Census Geocoder" },
            { headers: { "Cache-Control": "private, max-age=300" } },
          );
        } catch (error) {
          console.error("Address search failed", error);
          return Response.json(
            { matches: [], error: "Address validation service unavailable" },
            { status: 503 },
          );
        }
      },
    },
  },
});
