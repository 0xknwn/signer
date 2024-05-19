import { expect, describe, it } from "vitest";

describe(`onboard management`, {}, () => {
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
