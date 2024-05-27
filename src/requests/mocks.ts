import type { VerifyOutput } from "./verify.ts";
import type { SaveOnboardOutput } from "./onboard.ts";

export const mockVerify = async (
  email: string,
  code: string
): Promise<VerifyOutput> => {
  console.log("mockVerify", email, code);
  if (email === "a@b.c" && code === "123") {
    return {
      status: 200,
      key: "valid",
      expiresAt: Date.now() + 120,
    };
  }
  return { status: 401 };
};

export const mockSaveOnboard = async (
  accessKey: string,
  encryptedData: string
): Promise<SaveOnboardOutput> => {
  if (accessKey === "valid") {
    console.log("mockOnboard", accessKey, encryptedData);
    return { status: 201, managedAccounts: { mainnet: [], sepolia: [] } };
  }
  console.log("mockOnboard unauthorized");
  return { status: 401 };
};

export const mockReadOnboard = async (accessKey: string) => {
  console.log("mockOnboard", accessKey);
  if (!accessKey) {
    return { status: 401 };
  }
  if (accessKey === "valid") {
    return {
      status: 200,
      encryptedData:
        "lJYb0UsgdLrpc7tuTnlmt+Gnv2OhxGLZGxO6vUofffDk8Phc8BXfWc+QVhE6ejz5eYGfcJaiBY7dWl+y/e7bPgXdZ/PU6JNRwG3NSc7XebmuZNrx7xGzp73QXbkM3XcOAptSWxtT64QHU8zk+5Wp+TQF7Wf53cM0eMkwaS3kqOn3LNO06o5J+SL49M3OC2+lBvLspxe+rjP7qEGVNuobKHNSLRo7XfibX+dR4pOCloV5QN25ltknvNFriZu+HmxKFMmtWAgMpkaDACjgVq+s72Ps0dsMy7WvY2FosW5NJ/J+1h00xYrCR7vRFywbvnuu95emFLc82WvZyoDTzofFSA==.fEyM3SRaLcKtLsMOFYRznWpwElO5K91ACtFL6pWu6W6j6pc8zTNJefBcVwqwPy6qNyvQSeq3EKEhkDey250s8uzCLTW6DFt1jqHEYfrIbyClF6uz4UYT1X7/",
      managedAccounts: {
        mainnet: [],
        sepolia: [],
      },
    };
  }
  return { status: 404 };
};
