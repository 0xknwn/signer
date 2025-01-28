import { Plugin } from "vite";

async function streamToString(stream: ReadableStream): Promise<string> {
  const chunks: Array<any> = [];
  for await (let chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString("utf-8");
}

import apis from "./apis";

const API = (): Plugin => {
  return {
    name: "api:serve",
    apply: "serve",
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          for (const api of apis) {
            if (req.originalUrl === `/api/${api.route}`) {
              console.log("api:", req.originalUrl);
              const request = new Request("http://localhost:3000");
              const response = await api.handler(request);
              res.writeHead(response.status, {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
              });
              if (!response.body) {
                res.end("error");
                return;
              }
              const body = await streamToString(response.body);
              res.end(body);
              return;
            }
          }
          return next();
        });
      };
    },
  };
};

export type apiT = {
  route: string;
  handler: (req: Request) => Promise<Response>;
};

export default API;
