// file: _api/version.ts
import { geolocation } from "@vercel/edge";

// Should run on edge runtime
export const edge = true;

export default function handler(req: Request) {
  const { city } = geolocation(req);
  return new Response(`{"version": "dev", "city": "${city}"}`);
}
