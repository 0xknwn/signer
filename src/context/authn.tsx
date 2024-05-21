import { createContext, ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

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
  derivedKey0: string | null;
  managedAccounts: ManagedAccount[] | null;
  email: string | null;
};

const initialCredentials = {
  accessToken: null as AccessToken | null,
  derivedKey0: null as string | null,
  email: null as string | null,
} as Credentials;

export const Authn = createContext({
  credentials: initialCredentials,
  setCredentials: (_: Credentials) => {},
});
