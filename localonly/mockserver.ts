import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const restHandlers = [
  http.get(
    "http://localhost:3000/test",
    () => {
      return HttpResponse.json({ test: "test" });
    },
    {}
  ),
];

const server = setupServer(...restHandlers);

export const startServer = () => server.listen({ onUnhandledRequest: "error" });

export const stopServer = () => server.close();

export const resetServer = () => server.resetHandlers();
