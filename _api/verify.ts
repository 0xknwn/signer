// file: _api/verify.ts

// Should run on edge runtime
export const edge = true;

// Stream the response
export const streaming = true;

// Enable Incremental Static Regeneration for this endpoint
export const isr = {
  expiration: 30,
};

export default async function handler(request: Request) {
  const output = (await request.json()) as {
    email: string;
    verification_key: string;
  };
  if (!output.verification_key || !output.email) {
    return new Response(
      `{"message": "BadRequest: Missing email or verification key"}`,
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const { email, verification_key } = output;
  if (email === "a@b.c" && verification_key === "123") {
    return new Response(`{"key": "valid"}`, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(`{"message": "Unauthorized"}`, {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
