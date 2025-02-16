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
  addChannelReceivedMessage: (channelID: string, nonce: string) => void;
  hasChannelReceivedMessage: (channelID: string, nonce: string) => boolean;
  addChannelMessage: (channelID: string, message: any) => void;
  setPassphrase: (value: string) => void;
  setVerifier: (value: string) => void;
  verify: (key: CryptoKey | null) => Promise<boolean>;
  resetWallet: () => void;
  messages: { [channelID: string]: any[] };
  setLastChannelQueryTimestamp: (channelID: string, timestamp: number) => void;
  lastChannelQueryTimestamp: (channelID: string) => number;
}>({
  channels: {},
  addOrReplaceChannel: () => {},
  addChannelReceivedMessage: () => {},
  hasChannelReceivedMessage: () => false,
  addChannelMessage: () => {},
  challenge: "",
  verifier: "",
  cipher: null,
  passphrase: "",
  setPassphrase: () => {},
  setVerifier: () => {},
  verify: async () => false,
  resetWallet: () => {},
  messages: {},
  setLastChannelQueryTimestamp: () => {},
  lastChannelQueryTimestamp: () => 0,
});

export const useAuthn = () => {
  return useContext(AuthContext);
};
