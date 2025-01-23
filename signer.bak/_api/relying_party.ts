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
  const res = await fetch(`${process.env.BACKEND_URL}/v1/tenant`, {
    method: "GET",
    headers: {
      "x-api-key": process.env.BACKEND_API_KEY || "",
    },
  });
  const out = await res.json();

  const response = new Response(JSON.stringify({ name: out.relying_party }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  return response;
}
