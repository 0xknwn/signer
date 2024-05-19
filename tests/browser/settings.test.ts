import { expect, describe, it } from "vitest";

describe(`settings management`, {}, () => {
  describe(`you did not verify your BIP-39`, {}, () => {
    it.todo(
      `we should request people to acknowlege their BIP-39 can be lost and we can't recover it`
    );

    it.todo(
      `we should tell people that if we get hacked, their BIP-39 is the only way for them to recover`
    );

    it.todo(
      `we should request people to acknowledge that they are responsible for their BIP-39 and they submit the form with that acknowlegement`
    );

    it.todo(
      `there should be a warning everywhere until the BIP-39 is acknowleged`
    );
  });
});
