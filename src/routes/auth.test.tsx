import { describe, it } from "vitest";

// /auth route
//   - if the derived key or email are missing navigate to /
//   - query the challenge with the derived key public key and email
//   - query: /app/auth with the challenge signed
// @input:
//   - parameters: none
//   - props: none
//   - state: derived key #0 and email
// @output:
//   - location state: none
//     navigate: /
//   - state: email
//     navigate: /verify
//   - state: auth token and email
//     navigate: /onboard
//   - state: auth token and accounts
//     navigate: /accounts

describe("/auth management", () => {
  it.todo(`you could be signin with a email verification code`);

  it.todo(`log with username and password`);

  it.todo(`check if you can get an access token`);

  it.todo(`if no, go to the verify page`);

  it.todo(`if yes, go to the onboard page`);
});
