import { describe, it, expect } from "vitest";

describe("something truthy and falsy", () => {
  it("true to be true", () => {
    expect(true).toBe(true);
  });

  it("false to be false", () => {
    expect(false).toBe(false);
  });
});

describe("test environment variables", () => {
  it("MODE should be test", () => {
    expect(import.meta.env.MODE).toBe("test");
  });
});
