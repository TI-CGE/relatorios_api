const API_TOKEN = process.env.API_TOKEN ?? "";

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7).trim() || null;
  }
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) {
    return apiKey.trim() || null;
  }
  return null;
}

export function isAuthorized(req: Request): boolean {
  const token = getTokenFromRequest(req);
  return !!API_TOKEN && token === API_TOKEN;
}

export function unauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({ error: "Unauthorized" }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}
