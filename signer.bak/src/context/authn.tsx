import { createContext } from "react";

export type AccessToken = {
  key: string | null;
  expiresAt: number | null;
};

export type ManagedAccount = {
  address?: string;
  publicKey: string;
};

export type ManagedAccounts = {
  mainnet?: ManagedAccount[];
  sepolia?: ManagedAccount[];
  testnet?: ManagedAccount[];
};

export type Credentials = {
  accessToken?: AccessToken | null;
  signer?: CryptoKey;
  encrypter?: CryptoKey;
  managedAccounts?: ManagedAccounts;
  email?: string;
};

const initialCredentials = {
  accessToken: null as AccessToken | null,
  signer: null as CryptoKey | null,
  encrypter: null as CryptoKey | null,
  email: null as string | null,
} as Credentials;

export const Authn = createContext({
  credentials: initialCredentials,
  setCredentials: (_: Credentials) => {},
});
