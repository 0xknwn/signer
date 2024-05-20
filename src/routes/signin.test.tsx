import { describe, it } from "vitest";

// /signin route
// - it should request the username/password for the user that wants to signin
// - it should derive the key #0 and from the credentials and the relying_party
// - it should store the derived key #0 and the email in the state
// - it **MUST** forget the password
// - it should navigate to /auth
// @input:
//   - parameters: none
//   - props: none
//   - fields: email, password
//   - location state: none
// @output:
//   - location state: derived key #0 and email
//   - navigate: /auth

describe("/signin route", () => {
  it.todo(`you could be signin with a email verification code`);

  it.todo(`log with username and password`);

  it.todo(`check if you can get an access token`);

  it.todo(`if no, go to the verify page`);

  it.todo(`if yes, go to the onboard page`);
});

// /onboard
//  input:
//    state: email and auth token
//  logic:
//    - if the auth token is missing navigate to /
//    - request the account details as well as the password
//      - generate the derived key #1 and store the account and store in the backup storage
//      - get the account details back and navigate to /accounts
//  output:
//   - state: none
//   - navigate: /
//   - state: auth token
//   - navigate: /accounts

// /accounts
// input:
//   state: auth token
