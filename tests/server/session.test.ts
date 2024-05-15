import { expect, describe, it } from "vitest";

describe("signin and session", () => {
  describe("signin", () => {
    it.sequential.todo(
      "should be able to get a new access token from a signature",
      async () => {
        // Should request a challenge and sign it with the private key #0.
        // and from there get the data from the user
      }
    );
  });
  describe("session management", () => {
    it.sequential.todo(
      "should be able to get a new access token from a signature",
      async () => {
        // Should request a challenge and sign it with the private key #0.
        // and from there get the data from the user
      }
    );

    it.sequential.todo(
      "should be able to get a new access token the old access token",
      async () => {
        // Should request a new access token from the old access token
      }
    );

    it.sequential.todo("lock a session", async () => {
      // Should forget the access token
    });

    it.sequential.todo("forget the private key #0", async () => {
      // Should be able to forget the private key #0
    });

    it.sequential.todo("forget the private key #1", async () => {
      // Should be able to forget the private key #1
    });
  });

  describe("logout", () => {
    it.sequential.todo("lock a session", async () => {
      // Should forget the access token
    });

    it.sequential.todo("forget the private key #0", async () => {
      // Should be able to forget the private key #0
    });

    it.sequential.todo("forget the private key #1", async () => {
      // Should be able to forget the private key #1
    });
  });
});
