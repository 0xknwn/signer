import { useContext, createContext } from "react";
import { useState, useEffect } from "react";
import { store } from "./authn";
import {
  classHash as accountClassHash,
  SmartrAccountABI,
  accountAddress,
  classNames as accountClassNames,
} from "@0xknwn/starknet-modular-account";
import { CallData } from "starknet";
import { getKeys } from "./encryption";
import { useAuth } from "./authn";

export type account = {
  address: string;
  name: string;
  publickey: string;
};

export const AuthContext = createContext<{
  selectedAccountNumber: number;
  setSelectedAccountNumber: (value: number) => void;
  accounts: account[];
  addAccount: () => Promise<account | null>;
}>({
  setSelectedAccountNumber: () => {},
  selectedAccountNumber: 0,
  accounts: [],
  addAccount: async () => null,
});

export const useAccounts = () => {
  return useContext(AuthContext);
};

type AccountsProviderProps = {
  children: React.ReactNode;
};

export const AccountsProvider = ({ children }: AccountsProviderProps) => {
  const [accounts, setAccounts] = useState([] as account[]);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(0);
  const { passphrase } = useAuth();

  useEffect(() => {
    if (!passphrase || passphrase === "") {
      let accountNumber = 0;
      while (true) {
        const account = localStorage.getItem(
          `${store.accounts}/${accountNumber}`
        );
        if (!account) {
          break;
        }
        localStorage.removeItem(`${store.accounts}/${accountNumber}`);
        accountNumber++;
      }
      setAccounts([]);
    }
  }, [passphrase]);

  const addAccount = async () => {
    try {
      const accounts = await getAccounts();
      const index = accounts.length;
      const { publicKey } = getKeys(passphrase, index);
      const starkValidatorClassHash = accountClassHash(
        accountClassNames.StarkValidator
      );
      const calldata = new CallData(SmartrAccountABI).compile("constructor", {
        core_validator: starkValidatorClassHash,
        args: [publicKey],
      });
      const address = accountAddress(
        accountClassNames.SmartrAccount,
        publicKey,
        calldata
      );
      const account = {
        address,
        name: `Account #${index}`,
        publickey: publicKey,
      };
      localStorage.setItem(
        `${store.accounts}/${index}`,
        JSON.stringify(account)
      );
      setAccounts([...accounts, account]);
      return account;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const getAccounts = async () => {
    let accountNumber = 0;
    const accounts: account[] = [];
    while (true) {
      const account = localStorage.getItem(
        `${store.accounts}/${accountNumber}`
      );
      if (!account || account === "") {
        break;
      }
      accounts.push(JSON.parse(account));
      accountNumber++;
    }
    return accounts;
  };

  useEffect(() => {
    (async () => {
      let a = await getAccounts();
      setAccounts(a);
    })();
  }, []);

  const value = {
    selectedAccountNumber,
    setSelectedAccountNumber,
    accounts,
    addAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
