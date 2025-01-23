import { describe, it, expect } from "vitest";

import { getKeys } from "./encryption";

describe("encryption management", () => {
  // @todo: investigate why the private key does not match argent private key
  // and change the algorithm to match argent's
  it(`derive private key from sample mnemonic`, {}, () => {
    const mnemonic =
      "family stem craft trophy absent honey report fitness basic envelope net access";
    const { privateKey, publicKey } = getKeys(mnemonic);
    expect(privateKey).toBe(
      "0x8d89cdcdaba6e37067795e592b7023091dd36c065500887e2a39261e17bc57"
    );
    expect(publicKey).toBe(
      "0x06fa89fd86bac20956c717bcc81f629cf44427f2d577171aef1b00db21b41524"
    );
  });
});
