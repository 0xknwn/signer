import { expect, describe, it, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { Verify } from "./verify.tsx";
import { Accounts } from "./accounts.tsx";
import { Signin } from "./signin.tsx";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";

export const restHandlers = [
  http.post("/api/verify", () => {
    return HttpResponse.json({ key: "value" });
  }),
];

const server = setupServer(...restHandlers);

describe("check the email code", () => {
  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  //  Close server after all tests
  afterAll(() => server.close());

  // Reset handlers after each test `important for test isolation`
  afterEach(() => server.resetHandlers());
  it("navigates to /verify without a state and get back to /signin", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/verify" }]}>
        <Routes>
          <Route path="signin" element={<Signin />} />
          <Route path="verify" element={<Verify />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Signin: /signin")).toBeInTheDocument();
  });

  it("navigates to /verify with a state and succeed in verification", async () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/verify", state: { key: "value" } }]}
      >
        <Routes>
          <Route path="signin" element={<Signin />} />
          <Route path="verify" element={<Verify />} />
          <Route path="accounts" element={<Accounts />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("verify")).toBeInTheDocument();

    const user = userEvent.setup();
    const signin = vi.spyOn(user, "click");

    const verifyButton = screen.getByText("verify");
    await user.click(verifyButton);
    expect(signin).toHaveBeenCalledTimes(1);

    const accountsHeader = screen.getByText("Route: /accounts");
    expect(accountsHeader).toBeInTheDocument();
  });
});
