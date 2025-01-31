// file: _api/version.ts

// Should run on edge runtime
export const edge = true;

// Stream the response
export const streaming = true;

// Enable Incremental Static Regeneration for this endpoint
// export const isr = {
//   expiration: 30,
// };

export default async function handler(req, res) {
  res.send({version: "dev" })
}
