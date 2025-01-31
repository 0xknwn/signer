import { Plugin, Connect } from "vite";
import { Buffer } from "buffer";

async function streamToString(stream: ReadableStream): Promise<string> {
  const chunks: Uint8Array<ArrayBufferLike>[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString("utf-8");
}

import apis from "./apis";
import rpc from "./rpc";
import { request } from "./rpc";

const API = (): Plugin => {
  return {
    name: "api:serve",
    apply: "serve",
    configureServer(server) {
      return () => {
        server.middlewares.use(
          async (
            req: Connect.IncomingMessage & {
              on: (event: string, fn: () => void) => void;
            },
            res,
            next
          ) => {
            for (const api of apis) {
              if (req.originalUrl === `/api/${api.route}`) {
                const request = new Request("http://localhost:3000");
                const response = await api.handler(request);
                if (response.body) {
                  const responseBody = await streamToString(response.body);
                  console.log("[API]:", req.originalUrl, "<=", responseBody);
                  res.writeHead(response.status, {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                  });
                  res.write(responseBody);
                  res.end();
                } else {
                  res.writeHead(response.status);
                  res.end();
                }
                return;
              }
            }
            if (req.originalUrl === `/rpc`) {
              let body = "";
              if (req.on) {
                req.on("data", (chunk) => {
                  body += chunk;
                });
                req.on("end", async () => {
                  const request = JSON.parse(body) as request;
                  const response = await rpc(request);
                  console.log(
                    "[API]:",
                    req.originalUrl,
                    body,
                    "=>",
                    JSON.stringify(response)
                  );
                  res.writeHead(200, {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                  });
                  res.write(JSON.stringify(response));
                  res.end();
                });
              }
              return;
            }
            return next();
          }
        );
      };
    },
  };
};

export type apiT = {
  route: string;
  handler: (req: Request) => Promise<Response>;
};

export default API;
