import { describe, it } from "vitest";

// /onboard route
//    - if the auth token is missing navigate to /
//    - request the account details as well as the password
//      - generate the derived key #1 and store the account and store in the backup storage
//      - get the account details back and navigate to /accounts
// @input:
//   - parameters: none
//   - props: none
//   - fields:
//   - location state: email and auth token
// @output:
//   - state: none
//     navigate: /
//   - state: auth token
//     navigate: /accounts

describe("/onboard route", () => {
  it.todo(`define the scenarios`);

  it.todo(`if you are here, you should have an access token`);

  describe(`you already have a web account`, {}, () => {
    it.todo(`you should display the account`);
  });

  describe(`you did not generate your web account yet`, {}, () => {
    it.todo(`you could simply generate and store the web account`);

    it.todo(`you could decide to enter an existing web account`);

    it.todo(`you could migrate from argent/braavos`);
  });
});
