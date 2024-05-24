import {
  expect,
  describe,
  it,
  vi,
  afterAll,
  afterEach,
  beforeAll,
} from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { derive } from "../helpers/encryption";

import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import { AppRouter } from "./approuter.tsx";
import { VerifyRequest } from "./verify.tsx";
import { AccessToken } from "../context/authn.tsx";

const verifyHandler = http.post("/api/verify", async ({ request }) => {
  const payload = await request.json();
  if (payload === null || typeof payload !== "object") {
    return HttpResponse.json("", { status: 400 });
  }
  const req = new VerifyRequest(payload);
  if (!req.isValid()) {
    return HttpResponse.json("", { status: 400 });
  }
  if (req.email === "a@b.c" && req.verification_key === "123") {
    return HttpResponse.json({ key: "valid" });
  }
  return HttpResponse.json("", { status: 401 });
});

export const restHandlers = [verifyHandler];

const server = setupServer(...restHandlers);

describe("manage the email verification", () => {
  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  //  Close server after all tests
  afterAll(() => server.close());

  // Reset handlers after each test `important for test isolation`
  afterEach(() => server.resetHandlers());
  it("navigates to /signin without proper state", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/verify" }]}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText("Signin: /signin")).toBeInTheDocument();
  });

  it("sticks to /verify with proper state", async () => {
    const { signer, encrypter } = await derive("a@b.c", "123");
    const initialCredentials = {
      accessToken: null as AccessToken | null,
      signer,
      encrypter,
      email: "a@b.c" as string | null,
      managedAccounts: null,
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: "/verify" }]}>
        <AppRouter mockCredentials={initialCredentials} />
      </MemoryRouter>
    );

    expect(screen.getByText("Verify: /verify")).toBeInTheDocument();
  });

  it("navigates to /onboard when sending the right verification code", async () => {
    const { signer, encrypter } = await derive("a@b.c", "123");
    let initialCredentials = {
      accessToken: null as AccessToken | null,
      signer,
      encrypter,
      email: "a@b.c" as string | null,
      managedAccounts: null,
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: "/verify" }]}>
        <AppRouter mockCredentials={initialCredentials} />
      </MemoryRouter>
    );

    expect(screen.getByText("verify")).toBeInTheDocument();

    const user = userEvent.setup();
    const signin = vi.spyOn(user, "click");

    const verifyButton = screen.getByText("verify");
    const label = screen.getByLabelText("Verification Code :");
    const verifyCode = label.closest("input");
    expect(verifyCode).toBeInTheDocument();
    if (verifyCode === null) {
      throw new Error("No input found");
    }
    await user.type(verifyCode, "123");
    await user.click(verifyButton);
    expect(signin).toHaveBeenCalledTimes(1);

    const accountsHeader = screen.getByText("Onboarding: /onboarding");
    expect(accountsHeader).toBeInTheDocument();
  });

  it("navigates back to /signin with the wrong verification code", async () => {
    const { signer, encrypter } = await derive("a@b.c", "123");
    let initialCredentials = {
      accessToken: null as AccessToken | null,
      signer,
      encrypter,
      email: "a@b.c" as string | null,
      managedAccounts: null,
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: "/verify" }]}>
        <AppRouter mockCredentials={initialCredentials} />
      </MemoryRouter>
    );

    expect(screen.getByText("verify")).toBeInTheDocument();

    const user = userEvent.setup();
    const signin = vi.spyOn(user, "click");

    const verifyButton = screen.getByText("verify");
    const label = screen.getByLabelText("Verification Code :");
    const verifyCode = label.closest("input");
    expect(verifyCode).toBeInTheDocument();
    if (verifyCode === null) {
      throw new Error("No input found");
    }
    await user.type(verifyCode, "124");
    await user.click(verifyButton);
    expect(signin).toHaveBeenCalledTimes(1);

    const accountsHeader = screen.getByText("Signin: /signin");
    expect(accountsHeader).toBeInTheDocument();
  });

  describe(`you did verify your email`, {}, () => {
    it.todo(`it could be that the credentials are wrong`);

    it.todo(
      `propose to reconnect or to reset the BIP-39 (it will require a 1-week delay)`
    );
  });

  describe(`you did verify your email`, {}, () => {
    it.todo(`it could be that there is a bug. Did you actually onboard?`);

    it.todo(
      `if you have not onboarded, you could reveify your email right away`
    );

    it.todo(
      `if you have onboarded, then the derived key #0 has worked. Check the service status or open a ticket`
    );
  });

  describe(
    `you did verify your email but you have lost your password`,
    {},
    () => {
      it.todo(
        `you might want to reset your password but you will require some verification and a 1-week delay`
      );
    }
  );
});
