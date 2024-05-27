import type { ManagedAccounts } from "../context/authn";
import { mockSaveOnboard, mockReadOnboard } from "./mocks";

export type SaveOnboardOutput = {
  status: number;
  managedAccounts?: ManagedAccounts;
};

const apiSaveOnboard = async (
  accessKey: string | null,
  encryptedData: string
): Promise<SaveOnboardOutput> => {
  if (!accessKey) {
    return { status: 401 };
  }
  return await fetch("/api/onboard", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      encryptedData,
      managedAccounts: {
        mainnet: [],
        sepolia: [],
      },
    }),
  });
};

export const saveOnboard =
  import.meta.env.MODE === "development" ? mockSaveOnboard : apiSaveOnboard;

const apiReadOnboard = async (accessKey: string | null) => {
  if (!accessKey) {
    return { status: 401 };
  }
  const res = await fetch("/api/onboard", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessKey}`,
    },
    method: "GET",
  });
  if (res.status !== 200) {
    return { status: res.status };
  }
  const { encryptedData, managedAccounts } = (await res.json()) as {
    encryptedData: string;
    managedAccounts: ManagedAccounts;
  };
  return { status: 200, encryptedData, managedAccounts };
};

export const readOnboard =
  import.meta.env.MODE === "development" ? mockReadOnboard : apiReadOnboard;
