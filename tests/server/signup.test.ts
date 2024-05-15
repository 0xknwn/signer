import { expect, describe, it } from "vitest";

const { subtle } = globalThis.crypto;

describe("signup", () => {
  describe("register the email, password and attributes", () => {
    it.sequential.todo(
      "should request a challenge for an operation",
      async () => {
        // the challenge should be a random number that is stored in the
        // database with a TTL of 30 seconds. The response time for the API
        // should be at least 3 second to avoid brute force attacks.
      }
    );

    it.sequential.todo("should send a signup request", async () => {
      // the request should include an email, a username, a color,
      // a public key, the reliable party and a user identifier
      // that is computed from all those data.
      //
      // Note: It **cannot** be checked but the private key should be
      // computed from the email, the password, a number and the reliable party
      // with the PBKDF2 algorithm.
    });

    it.sequential.todo(
      "should store the data and a verification key for the email",
      async () => {
        // Data should be stored in the database with a primary index and RP as
        // a hash key. It should contain the email, the username, the color,
        // the public key #0, the reliable party (also part of the key), a flag
        // to say if the email is **NOT** verified yet. In addition:
        // - The public key #0 should be used as a secondary index
        // - The email #0 should be used as a secondary index that is unique
        // - Those data should have a TTL of 7 days.
        //
        // Another table should include a verification key that is valid for
        // 24h associated with the user identifier.
      }
    );
  });

  describe("kyc the email address", () => {
    it.sequential.todo(
      "should **NOT** create an account if the email is already used",
      async () => {
        // Instead it should send an email to the user to say that is already
        // has an account and should login instead. If he has forgotten the
        // password, he should trigger the guardian process.
      }
    );

    it.sequential.todo(
      "should request an email that is not yet verified",
      async () => {
        // You should be able to request an email that is not yet verified.
      }
    );

    it.sequential.todo(
      "should submit the verification code from the email",
      async () => {
        // The user should be able to enter the verification code from the email
        // signed with the private key #0. The server should verify the signature
        // and mark the email address as verified. It should return an access
        // token that is valid for 30 seconds.
      }
    );
  });

  describe("secure the private keys and accounts", () => {
    it.sequential.todo(
      "should store an encrypted mnemonic file and a list of public keys",
      async () => {
        // The user should be able to submit an encrypted mnemonic file that
        // might also contain private keys. The server should store the file.
        // the file should be encrypted with the public key #1 so there is no
        // way to decrypt it. The server should also store the public keys
        // associated with the private keys that have been initialized (limited
        // to 10 keys). The account addresses should be computed and stored
        // in the database.
      }
    );
  });

});
