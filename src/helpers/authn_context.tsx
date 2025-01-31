import { useContext, createContext } from "react";

export const AuthContext = createContext<{
  challenge: string;
  verifier: string;
  cipher: CryptoKey | null;
  passphrase: string;
  setPassphrase: (value: string) => void;
  setVerifier: (value: string) => void;
  verify: (key: CryptoKey | null) => Promise<boolean>;
  resetWallet: () => void;
}>({
  challenge: "",
  verifier: "",
  cipher: null,
  passphrase: "",
  setPassphrase: () => {},
  setVerifier: () => {},
  verify: async () => false,
  resetWallet: () => {},
});

export const useAuthn = () => {
  return useContext(AuthContext);
};
