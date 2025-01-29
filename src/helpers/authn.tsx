import { useContext, createContext } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { decrypt, encrypt } from "./encryption";
import {
  classHash as accountClassHash,
  SmartrAccountABI,
  accountAddress,
  classNames as accountClassNames,
} from "@0xknwn/starknet-modular-account";
import { CallData } from "starknet";
import { getKeys } from "./encryption";

export type account = {
  address: string;
  name: string;
  publickey: string;
};

export const AuthContext = createContext<{
  challenge: string;
  verifier: string;
  cipher: CryptoKey | null;
  passphrase: string;
  setPassphrase: (value: string) => void;
  setVerifier: (value: string) => void;
  verify: (key: CryptoKey | null) => Promise<boolean>;
  resetWallet: () => void;
  getAccounts: () => Promise<account[]>;
  addAccount: () => Promise<account | null>;
}>({
  challenge: "",
  verifier: "",
  cipher: null,
  passphrase: "",
  setPassphrase: () => {},
  setVerifier: () => {},
  verify: async () => false,
  resetWallet: () => {},
  getAccounts: async () => [],
  addAccount: async () => null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const store = {
  challenge: "smartr-challenge",
  verifier: "smartr-verifier",
  mnemonic: "smartr-mnemonic",
  accounts: "smartr-accounts",
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(
    localStorage.getItem(store.challenge) ?? ""
  );
  const [verifier, setStateVerifier] = useState(
    localStorage.getItem(store.verifier) ?? ""
  );
  const [passphrase, setStatePassphrase] = useState("");
  const setPassphrase = async (value: string) => {
    if (!cipher) {
      throw new Error("no cipher");
    }
    const output = await encrypt(cipher, value);
    localStorage.setItem(store.mnemonic, output);
    setStatePassphrase(value);
  };

  const setVerifier = (value: string) => {
    localStorage.setItem(store.verifier, value);
    setStateVerifier(value);
  };
  const [cipher, setCipher] = useState(null as CryptoKey | null);

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
      return account;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const removeAccounts = async () => {
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
  };

  const verify = async (key: CryptoKey | null) => {
    if (key) {
      let output = "";
      try {
        output = await decrypt(key, verifier);
      } catch (e) {
        setCipher(null);
        return false;
      }
      if (output === challenge) {
        setCipher(key);
        const mnemonic = localStorage.getItem(store.mnemonic);
        if (mnemonic && mnemonic !== "") {
          const decodedPassphrase = await decrypt(key, mnemonic);
          setStatePassphrase(decodedPassphrase);
        }
        return true;
      }
    }
    setCipher(null);
    return false;
  };

  useEffect(() => {
    if (verifier && verifier !== "") {
      localStorage.setItem(store.verifier, verifier);
      return;
    }
    localStorage.removeItem(store.verifier);
    localStorage.removeItem(store.mnemonic);
    setStatePassphrase("");
    removeAccounts();
    navigate("/");
  }, [verifier]);

  useEffect(() => {
    if (!challenge || challenge === "") {
      const id = self.crypto.randomUUID();
      localStorage.setItem(store.challenge, id);
      setChallenge(id);
      return;
    }
  }, []);

  useEffect(() => {
    if (verifier && verifier !== "" && !cipher) {
      navigate("/login");
    }
  }, [cipher]);

  const resetWallet = () => {
    setVerifier("");
  };

  const value = {
    challenge,
    verifier,
    cipher,
    passphrase,
    setPassphrase,
    setVerifier,
    verify,
    resetWallet,
    getAccounts,
    addAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { cipher, verifier, passphrase } = useAuth();
  const location = useLocation();
  if ((!verifier || verifier === "") && location.pathname !== "/") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if (!cipher && location.pathname !== "/login") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (
    (!passphrase || passphrase === "") &&
    location.pathname !== "/seed" &&
    location.pathname !== "/login"
  ) {
    return <Navigate to="/seed" replace state={{ from: location }} />;
  }
  return children;
};
