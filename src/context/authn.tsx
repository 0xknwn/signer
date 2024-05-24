import { createContext } from "react";

export type AccessToken = {
  key: string | null;
  expiresAt: number | null;
};

export type ManagedAccount = {
  key: string | null;
  expiresAt: number | null;
};

export type Credentials = {
  accessToken: AccessToken | null | undefined;
  signer: CryptoKey | null;
  encrypter: CryptoKey | null;
  managedAccounts: ManagedAccount[] | null;
  email: string | null;
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
