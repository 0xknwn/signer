import { Buffer } from "buffer";

import { mnemonicToSeedSync } from "@scure/bip39";
import { HDKey } from "@scure/bip32";
import { getStarkKey, grindKey } from "@scure/starknet";
import { encode } from "starknet";

export const STANDARD_DERIVATION_PATH = "m/44'/9004'/0'/0";

export const derive = async (email: string, password: string) => {
  const rely_party = window.location.hostname;
  if (!rely_party || rely_party === "") {
    throw new Error("rely_party is not set");
  }
  const enc = new TextEncoder();
  const root = enc.encode(`${rely_party}/${password}`);
  const material = await window.crypto.subtle.importKey(
    "raw",
    root,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  const encrypter = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(`${email}/0`),
      iterations: 65536,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const signer = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(`${email}/1`),
      iterations: 65536,
      hash: "SHA-256",
    },
    material,
    { name: "HMAC", hash: { name: "SHA-256" } },
    true,
    ["sign", "verify"]
  );

  return { encrypter, signer };
};

export const encrypt = async (encrypter: CryptoKey | null, data: string) => {
  if (!encrypter) {
    throw new Error("no encrypter");
  }
  const enc = new TextEncoder();
  const root = enc.encode(data);

  const iv = new Uint8Array(256);
  window.crypto.getRandomValues(iv);
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    encrypter,
    root
  );
  return `${Buffer.from(iv).toString("base64")}.${Buffer.from(
    encryptedData
  ).toString("base64")}`;
};

export const decrypt = async (decrypter: CryptoKey | null, data: string) => {
  if (!decrypter) {
    throw new Error("no decrypter");
  }
  const d = data.split(".");
  if (d.length !== 2) {
    throw new Error("invalid data");
  }
  const iv = Buffer.from(d[0], "base64");
  const encryptedData = Buffer.from(d[1], "base64");
  const decryptedData = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    decrypter,
    encryptedData
  );
  return new TextDecoder().decode(decryptedData);
};

export const getKeys = (mnemonic: string, index: number = 0) => {
  const seed = mnemonicToSeedSync(mnemonic.trim());
  const hdnodewallet = HDKey.fromMasterSeed(seed).derive(
    `${STANDARD_DERIVATION_PATH}/${index}`
  );
  const preGrindPrivateKey = hdnodewallet.privateKey;

  if (!preGrindPrivateKey) {
    throw new Error("Could not generate private key");
  }
  const grindPrivateKey = grindKey(preGrindPrivateKey);
  const privateKey = encode.sanitizeHex(
    encode.sanitizeBytes(grindPrivateKey, 2)
  );
  return {
    publicKey: encode.sanitizeHex(getStarkKey(privateKey)),
    privateKey,
  };
};
