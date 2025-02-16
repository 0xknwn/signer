// file: _api/rpc.ts

// Should run on edge runtime
export const edge = true;
const url = process.env.API_BASE_URL as string;

export default async function handler(request: Request) {
  // @todo: Implement the RPC handler with the ReadableStream to avoid the
  // memory overhead
  console.log("request", request);
  console.log("url", url);
  const requestBody = JSON.stringify(await request.json());
  const output = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });
  const responseBody = await output.json();
  if (responseBody) {
    return new Response(JSON.stringify(responseBody), {
      status: output.status,
    });
  }
  return new Response(`{"statusText": "Not Found"}`, { status: output.status });
}
