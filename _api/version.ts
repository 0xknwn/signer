// file: _api/version.ts

// Should run on edge runtime
export const edge = true;

// Stream the response
export const streaming = true;

// Enable Incremental Static Regeneration for this endpoint
export const isr = {
  expiration: 30,
};

export default async function handler(request: Request) {
  // const res = await fetch(`${process.env.BACKEND_URL}/version`);
  const res = { json: async () => ({ version: "1.0.0" }) };
  const out = await res.json();

  const response = new Response(JSON.stringify({ version: out.version }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  return response;
}
