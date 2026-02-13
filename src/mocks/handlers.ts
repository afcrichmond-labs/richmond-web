import { http, HttpResponse } from "msw";

export const handlers = [
  // User profile v2 mock (while waiting for real API)
  http.get("/api/v2/users/:id", ({ params }) => {
    return HttpResponse.json({
      data: {
        id: params.id,
        name: "Mock User",
        email: "mock@richmond.dev",
        avatar_url: "https://placeholders.dev/100",
        department: "engineering",
        role: "engineer",
        created_at: "2025-01-15T00:00:00Z",
      },
      meta: { api_version: "v2" },
    });
  }),

  // Batch user lookup mock
  http.get("/api/v2/users", ({ request }) => {
    const url = new URL(request.url);
    const ids = url.searchParams.get("ids")?.split(",") || [];
    return HttpResponse.json({
      data: ids.map((id) => ({
        id,
        name: `Mock User ${id.slice(0, 4)}`,
        email: `user-${id.slice(0, 4)}@richmond.dev`,
      })),
      meta: { api_version: "v2", count: ids.length },
    });
  }),
];
