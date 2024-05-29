import { ManagedAccounts } from "../context/authn";
import { mockVerify } from "./mocks";

export type VerifyOutput = {
  status: number;
  key?: string;
  expiresAt?: number;
  managedAccounts?: ManagedAccounts;
};

const apiVerify = async (
  email: string | null,
  code: string
): Promise<VerifyOutput> => {
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
  const { key, managedAccounts } = (await res.json()) as {
    key: string;
    managedAccounts?: ManagedAccounts;
  };
  return {
    status: res.status,
    key,
    expiresAt: Date.now() + 120000,
    managedAccounts,
  };
};

export const verify =
  import.meta.env.MODE === "development" ? mockVerify : apiVerify;
