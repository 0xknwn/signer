import { useContext, createContext } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { useState, useEffect } from "react";

export const AuthContext = createContext<{
  challenge: string;
  verifier: string;
  cipher: string;
  mnemonic: string;
  setVerifier: (value: string) => void;
  verify: (value: string) => Promise<boolean>;
  resetWallet: () => void;
  setMnemonic: (value: string) => void;
}>({
  challenge: "",
  verifier: "",
  cipher: "",
  mnemonic: "",
  setVerifier: () => {},
  verify: async () => false,
  resetWallet: () => {},
  setMnemonic: () => {},
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
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(
    localStorage.getItem(store.challenge) ?? ""
  );
  const [verifier, setStateVerifier] = useState(
    localStorage.getItem(store.verifier) ?? ""
  );
  const [mnemonic, setStateMnemonic] = useState(
    localStorage.getItem(store.mnemonic) ?? ""
  );
  const setMnemonic = (value: string) => {
    localStorage.setItem(store.mnemonic, value);
    setStateMnemonic(value);
  };
  const setVerifier = (value: string) => {
    localStorage.setItem(store.verifier, value);
    setStateVerifier(value);
  };
  const [cipher, setCipher] = useState("");

  const verify = async (key: string) => {
    if (key !== "123") {
      setCipher("");
      return false;
    }
    setCipher(key);
    return true;
  };

  useEffect(() => {
    if (verifier && verifier !== "") {
      localStorage.setItem(store.verifier, verifier);
      return;
    }
    localStorage.removeItem(store.verifier);
    localStorage.removeItem(store.mnemonic);
    setStateMnemonic("");
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
    if (verifier && verifier !== "" && (!cipher || cipher === "")) {
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
    mnemonic,
    setVerifier,
    verify,
    resetWallet,
    setMnemonic,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { cipher, verifier, mnemonic } = useAuth();
  const location = useLocation();
  if ((!verifier || verifier === "") && location.pathname !== "/") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if ((!cipher || cipher === "") && location.pathname !== "/login") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (
    (!mnemonic || mnemonic === "") &&
    location.pathname !== "/seed" &&
    location.pathname !== "/login"
  ) {
    return <Navigate to="/seed" replace state={{ from: location }} />;
  }
  return children;
};
