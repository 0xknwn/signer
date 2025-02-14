import { useContext, createContext } from "react";
import { acknowledgeChannelRequestResult } from "@0xknwn/connect-api";

export type SignerProps = {
  identityKey: CryptoKeyPair;
  sharingKey: CryptoKeyPair;
  encryptionKey: CryptoKey;
};

export type ChannelProps = {
  dapp: acknowledgeChannelRequestResult | null;
  signer: SignerProps | null;
};

export const AuthContext = createContext<{
  channels: { [channelID: string]: ChannelProps };
  challenge: string;
  verifier: string;
  cipher: CryptoKey | null;
  passphrase: string;
  addOrReplaceChannel: (value: { [channelID: string]: ChannelProps }) => void;
  setPassphrase: (value: string) => void;
  setVerifier: (value: string) => void;
  verify: (key: CryptoKey | null) => Promise<boolean>;
  resetWallet: () => void;
}>({
  channels: {},
  addOrReplaceChannel: () => {},
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
