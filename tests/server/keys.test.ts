import { expect, describe, it } from "vitest";

const { subtle } = globalThis.crypto;
import * as crypto from "crypto";

const toHex = (arr: Uint8Array): string => {
  let output = "";
  arr.forEach((code) => {
    output += code.toString(16);
  });
  return "0x" + output;
};

const pbkdf2 = async (
  pass: string,
  salt: string,
  iterations = 5000,
  length = 256
) => {
  const ec = new TextEncoder();
  const key = await subtle.importKey("raw", ec.encode(pass), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-512",
      salt: ec.encode(salt),
      iterations,
    },
    key,
    length
  );
  return bits;
};

describe("key management", () => {
  describe("generate keys from password", () => {
    let client = {
      username: "mail@example.com",
      password: "password",
      rp: "reliableparty.com",
    };

    it("generates PBKDF2 key #0 from email/password", async () => {
      if (!client.username || !client.password || !client.rp) {
        throw new Error("Missing username, password or reliable party");
      }

      const result = await pbkdf2(
        client.password,
        `${client.username}/${client.rp}/0`
      );
      expect(toHex(new Uint8Array(result))).toBe(
        "0x86244f5e33333729ba6743fcbd3e86c5f454b5e3c9afb6533f146f36289"
      );
    });

    it("generates PBKDF2 key #1 from email/password", async () => {
      const result = await pbkdf2(
        "password",
        `${client.username}/${client.rp}/1`
      );
      expect(toHex(new Uint8Array(result))).toBe(
        "0xc25f133d2e91849733eef811a1e4f4cba8add158cfa86bd78f22729abfa552"
      );
    });

    it("agrees on symetric key with 2 ECDH key pairs", async () => {
      const aliceKey = await subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-384",
        },
        false,
        ["deriveKey"]
      );

      const bobKey = await subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-384",
        },
        false,
        ["deriveKey"]
      );

      const deriveSecretKey = (privateKey: CryptoKey, publicKey: CryptoKey) => {
        return subtle.deriveKey(
          {
            name: "ECDH",
            public: publicKey,
          },
          privateKey,
          {
            name: "AES-GCM",
            length: 256,
          },
          true,
          ["encrypt", "decrypt"]
        );
      };

      const aliceSecretKey = await deriveSecretKey(
        aliceKey.privateKey,
        bobKey.publicKey
      );

      const bobSecretKey = await deriveSecretKey(
        bobKey.privateKey,
        aliceKey.publicKey
      );
      const iv = crypto.randomBytes(12);
      const message = await subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        bobSecretKey,
        new Uint8Array([1, 2, 3, 4])
      );
      const v = await subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        aliceSecretKey,
        message
      );
      expect(new Uint8Array(v)).toEqual(new Uint8Array([1, 2, 3, 4]));
    });
  });
});
