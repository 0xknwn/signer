// file: _api/version.ts

// Should run on edge runtime
export const edge = true;

// Always add those header to this endpoint
export const headers = {};

// Stream the response
export const streaming = true;

// Enable Incremental Static Regeneration for this endpoint
export const isr = {
  expiration: 30,
};

export default async function handler(request: Request) {
  const response = new Response(JSON.stringify({ version: "dev" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  return response;
}
