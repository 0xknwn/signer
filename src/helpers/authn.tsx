import { useLocation, useNavigate, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { decrypt, encrypt } from "./encryption";
import { store } from "./store";

import { AuthContext, useAuthn, type ChannelProps } from "./authn_context";

type AuthProviderProps = {
  children: React.ReactNode;
};

// @todo: persist the channels in local storage
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [channels, setChannels] = useState(
    {} as { [channelID: string]: ChannelProps }
  );

  const addOrReplaceChannel = (value: {
    [channelID: string]: ChannelProps;
  }) => {
    setChannels({ ...channels, ...value });
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
    Object.keys(channels).forEach((k) => {
      console.log(k, channels[k].dapp?.agentPublicKey);
    });
  }, [channels]);

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
    challenge,
    verifier,
    cipher,
    passphrase,
    setPassphrase,
    setVerifier,
    verify,
    resetWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
