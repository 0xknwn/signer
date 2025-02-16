import { useLocation, useNavigate, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { decrypt, encrypt } from "./encryption";
import { store } from "./store";
import Refreshers from "./refreshers";
import { AuthContext, useAuthn, type ChannelProps } from "./authn_context";

type AuthProviderProps = {
  children: React.ReactNode;
};

// @todo: enable store in the API to recover on another device
// @todo: check when the network or api are down and add a banner to the UI
// so that people can understand what is happening
// @todo: deploy on sepolia on the vercel URL
// @todo: persist the channels in local storage
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [channels, setChannels] = useState(
    {} as { [channelID: string]: ChannelProps }
  );

  const [channelMessages, setChannelMessages] = useState(
    {} as { [channelID: string]: any[] }
  );

  const [channelReceivedMessages, setChannelReceivedMessages] = useState(
    {} as { [channelID: string]: { [nonce: string]: boolean } }
  );

  const addOrReplaceChannel = (value: {
    [channelID: string]: ChannelProps;
  }) => {
    setChannels((previousChannels) => ({ ...previousChannels, ...value }));
  };

  const addChannelReceivedMessage = (channelID: string, nonce: string) => {
    setChannelReceivedMessages((previousChannelReceivedMessages) => {
      return {
        ...previousChannelReceivedMessages,
        ...{
          [channelID]: {
            ...(previousChannelReceivedMessages[channelID] ?? {}),
            ...{ [nonce]: true },
          },
        },
      };
    });
  };

  const hasChannelReceivedMessage = (channelID: string, nonce: string) => {
    return channelReceivedMessages[channelID]?.[nonce] ?? false;
  };

  const addChannelMessage = (channelID: string, message: any) => {
    setChannelMessages((previousChannelMessages) => ({
      ...previousChannelMessages,
      ...{
        [channelID]: [...(previousChannelMessages[channelID] ?? []), message],
      },
    }));
  };

  const [channelQueryUnixTimestamp, setChannelQueryUnixTimestamp] = useState(
    {} as { [channelID: string]: number }
  );

  const lastChannelQueryTimestamp = (channelID: string) => {
    return channelQueryUnixTimestamp[channelID] ?? 0;
  };

  const setLastChannelQueryTimestamp = (
    channelID: string,
    timestamp: number
  ) => {
    setChannelQueryUnixTimestamp((previousChannelQueryUnixTimestamp) => ({
      ...(previousChannelQueryUnixTimestamp ?? {}),
      ...{ [channelID]: timestamp },
    }));
  };

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

  const verify = async (key: CryptoKey | null) => {
    if (key) {
      let output = "";
      try {
        output = await decrypt(key, verifier);
      } catch {
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
    localStorage.removeItem(store.username);
    setStatePassphrase("");
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
    channels,
    addOrReplaceChannel,
    addChannelReceivedMessage,
    hasChannelReceivedMessage,
    addChannelMessage,
    challenge,
    verifier,
    cipher,
    passphrase,
    setPassphrase,
    setVerifier,
    verify,
    resetWallet,
    messages: channelMessages,
    lastChannelQueryTimestamp,
    setLastChannelQueryTimestamp,
  };

  return (
    <AuthContext.Provider value={value}>
      <Refreshers />
      {children}
    </AuthContext.Provider>
  );
};

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { cipher, verifier, passphrase } = useAuthn();
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
