import { expect, describe, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { Routes } from "./routes.tsx";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { Authn, type Credentials, AccessToken } from "../context/authn.tsx";

export const restHandlers = [
  http.post("/api/verify", () => {
    return HttpResponse.json({ key: "value" });
  }),
];

const server = setupServer(...restHandlers);

// /verify
//  input:
//    - props: email
//  logic:
//    - if the email is missing navigate to /
//    - describes why you are on this page
//      - you have not verified the email
//      - you have typed a wrong credentials. If that is the case, you might want to request a password reset but it will take quite some time (at least 7 days) and it will require you confirm the fact you have lost your password from your email
//      - you are trying to hack an account. TL;DR: don't do that! That is a crime and we will do whatever we can to prevent this, including procecute you. First, we won't even tell you if what you are trying to hacked is actually actually linked to an existing account. If you try to brute force the email verification, we will stop testing after 3 failed attempts anyway so
//      - we have a bug in our system. If that is the case, we will provide you with a procedure to send us a signed challenge so we can investigate the issue. We never used any KYC procedure so even if we keep track of personal data so it could very much be that you are not the owner of the account you are trying to access.
//      - we have gone rogue ourselves. The good news is that you can check the code, you have never shared anything that would allow us to touch your account so we cannot do anything without your help. The bad news is that you will need to gain access to your account manually and you have a limited time to do that.
//  output:
//   - state: none
//   - navigate: /
//   - state: none
//     if the verified succeeded
//     navigate: /signin
//   - state: none
//     if the verified failed
//     navigate: /failed_verified

describe("check the email code", () => {
  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  //  Close server after all tests
  afterAll(() => server.close());

  // Reset handlers after each test `important for test isolation`
  afterEach(() => server.resetHandlers());
  it("navigates to /verify without a state and get back to /signin", async () => {
    const initialCredentials = {
      accessToken: null as AccessToken | null,
      derivedKey0: null as string | null,
      email: null,
      managedAccounts: null,
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: "/verify" }]}>
        <Authn.Provider
          value={{
            credentials: initialCredentials,
            setCredentials: (v: Credentials) => {
              initialCredentials.accessToken = v.accessToken || null;
            },
          }}
        >
          <Routes />
        </Authn.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Signin: /signin")).toBeInTheDocument();
  });

  it("navigates to /verify with a state and succeed in verification", async () => {
    const initialCredentials = {
      accessToken: null as AccessToken | null,
      derivedKey0: "123" as string | null,
      email: null,
      managedAccounts: null,
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: "/verify" }]}>
        <Authn.Provider
          value={{
            credentials: initialCredentials,
            setCredentials: (v: Credentials) => {
              initialCredentials.accessToken = v.accessToken || null;
            },
          }}
        >
          <Routes />
        </Authn.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("verify")).toBeInTheDocument();

    const user = userEvent.setup();
    const signin = vi.spyOn(user, "click");

    const verifyButton = screen.getByText("verify");
    await user.click(verifyButton);
    expect(signin).toHaveBeenCalledTimes(1);

    const accountsHeader = screen.getByText("Onboarding: /onboarding");
    expect(accountsHeader).toBeInTheDocument();
  });

  describe(`you did not verify your email yet`, {}, () => {
    it.todo(`you should have a form to enter the email code verification`);

    it.todo(
      `once the email code verification is successful, you should be disconnected`
    );
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
