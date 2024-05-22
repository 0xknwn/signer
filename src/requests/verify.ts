import { mockVerify } from "./mocks";

const apiVerify = async (email: string | null, code: string) => {
  if (email === null) {
    return { status: 401 };
  }
  const res = await fetch("/api/verify", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email,
      verification_key: code,
    }),
  });
  if (res.status !== 200) {
    return { status: res.status };
  }
  const { key } = (await res.json()) as { key: string };
  return { status: res.status, key, expiresAt: Date.now() + 120 };
};

export const verify =
  import.meta.env.MODE === "development" ? mockVerify : apiVerify;
