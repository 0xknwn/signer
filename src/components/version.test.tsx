import { describe, it, expect, afterAll, afterEach, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const posts = { version: "mock" };

export const restHandlers = [
  http.get(
    "http://localhost:3000/version",
    () => {
      return HttpResponse.json(posts);
    },
    {}
  ),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers());

import Version from "./version";

describe("test Version component", () => {
  it("renders component", async () => {
    render(<Version />);
    await waitFor(() => {
      const e = screen.getByText("version: mock");
      expect(e).toBeInTheDocument();
    });
  });
});
