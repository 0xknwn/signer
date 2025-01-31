import { useContext, createContext } from "react";

export type account = {
  address: string;
  name: string;
  publickey: string;
};

export type token = {
  address: string;
  name: string;
  value: bigint;
};

export const AccountContext = createContext<{
  selectedAccountNumber: number;
  setSelectedAccountNumber: (value: number) => void;
  accounts: account[];
  addAccount: () => Promise<account | null>;
  tokens: token[];
  refreshTokens: () => void;
}>({
  setSelectedAccountNumber: () => {},
  selectedAccountNumber: 0,
  accounts: [],
  addAccount: async () => null,
  tokens: [],
  refreshTokens: () => {},
});

export const useAccounts = () => {
  return useContext(AccountContext);
};
