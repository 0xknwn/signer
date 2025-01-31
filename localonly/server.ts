import express, {
  Request as ExpressRequest,
  Response as ExpessResponse,
} from "express";

const app = express();

const PORT = process.env.PORT || 3000;
import handler from "../_api/version";

app.get(
  "/api/version",
  async (request: ExpressRequest, response: ExpessResponse) => {
    const req = new Request("https://example.com");
    const res = handler(req);
    response.status(res.status).send(await res.json());
  }
);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
