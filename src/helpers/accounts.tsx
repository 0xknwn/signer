import { useState, useEffect } from "react";
import { RpcProvider, Contract, num } from "starknet";
import { store } from "./store";
import {
  classHash as accountClassHash,
  SmartrAccountABI,
  accountAddress,
  classNames as accountClassNames,
  ERC20ABI,
} from "@0xknwn/starknet-modular-account";
import { CallData } from "starknet";
import { getKeys } from "./encryption";
import { useAuthn } from "./authn_context";

import type { account, token } from "./account_context";
import { AccountContext } from "./account_context";

type AccountsProviderProps = {
  children: React.ReactNode;
};

export const AccountsProvider = ({ children }: AccountsProviderProps) => {
  const providerURL = window.location.origin + "/api/sepolia";
  const provider = new RpcProvider({ nodeUrl: providerURL });
  const [accounts, setAccounts] = useState([] as account[]);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(0);
  const { passphrase } = useAuthn();

  const [tokens, setTokens] = useState([
    {
      address:
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      name: "ETH",
      value: 0n,
    },
    {
      address:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      name: "STRK",
      value: 0n,
    },
  ] as token[]);

  const refreshTokens = async () => {
    if (accounts.length === 0) {
      return;
    }
    const t: token[] = [];
    for (const token of tokens) {
      const c = new Contract(ERC20ABI, token.address, provider);
      const result = await c.call("balance_of", [
        accounts[selectedAccountNumber].address,
      ]);
      token.value = num.toBigInt(result.toString());
      t.push(token);
    }
    setTokens(t);
  };

  useEffect(() => {
    const r = async () => {
      if (accounts.length === 0) {
        return;
      }
      const t: token[] = [];
      for (const token of tokens) {
        const c = new Contract(ERC20ABI, token.address, provider);
        const result = await c.call("balance_of", [
          accounts[selectedAccountNumber].address,
        ]);
        token.value = num.toBigInt(result.toString());
        t.push(token);
      }
      setTokens(t);
    };
    r();
  }, [selectedAccountNumber, accounts]);

  useEffect(() => {
    const mnemonic = localStorage.getItem(store.mnemonic);
    if ((!passphrase || passphrase === "") && (!mnemonic || mnemonic === "")) {
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
      const a = await getAccounts();
      setAccounts(a);
    })();
  }, []);

  const value = {
    selectedAccountNumber,
    setSelectedAccountNumber,
    accounts,
    addAccount,
    refreshTokens,
    tokens,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};
