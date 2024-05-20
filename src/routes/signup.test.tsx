import { describe, it } from "vitest";

// /signup route
// - if the password and password_verification are different refuses to submit
// - it should derive the key #0 and from the credentials and the relying_party
// - it should store the derived key #0 and the email in the state
// - it **MUST** forget the password
// - it should navigate to /auth
// @input:
//   - parameters: none
//   - props: none
//   - fields:  email, password, password_verification, color, nickname
//   - location state: none
// @output:
//   - location state: derived key #0 and email
//   - navigate: /auth

describe(`/signup management`, {}, () => {
  it.todo(`opens the signup page and request a set of data`);

  it.todo(`generate the derived key #0`);

  it.todo(`send a verification email`);

  it.todo(`go to the verify page`);
});
