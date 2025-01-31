import { describe, it, expect } from "vitest";

import handler from "../_api/version";

describe("Class", () => {
  it("fetch stuff", { timeout: 5000 }, async () => {
    const req = new Request("https://example.com");
    const res = await handler(req);
    const json = await res.json();
    expect(json).toEqual({ version: "dev", city: "San Francisco" });
  });
});
