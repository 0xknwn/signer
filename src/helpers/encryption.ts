export const derive = async (email: string, password: string) => {
  let rely_party = window.location.hostname;
  if (!rely_party || rely_party === "") {
    throw new Error("rely_party is not set");
  }
  const enc = new TextEncoder();
  let root = enc.encode(`${rely_party}/${password}`);
  const material = await window.crypto.subtle.importKey(
    "raw",
    root,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  let encrypter = await window.crypto.subtle.deriveKey(
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

  let signer = await window.crypto.subtle.deriveKey(
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
