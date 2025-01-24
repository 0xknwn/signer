import { useContext, createContext } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { useState, useEffect } from "react";

export const AuthContext = createContext<{
  challenge: string;
  verifier: string;
  cipher: string;
  setVerifier: (value: string) => void;
  verify: (value: string) => Promise<boolean>;
  resetWallet: () => void;
}>({
  challenge: "",
  verifier: "",
  cipher: "",
  setVerifier: () => {},
  verify: async () => false,
  resetWallet: () => {},
});

const fakeAuth = (): Promise<string> =>
  new Promise((resolve) => {
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
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
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(
    localStorage.getItem(store.challenge) ?? ""
  );
  const [verifier, setStateVerifier] = useState(
    localStorage.getItem(store.verifier) ?? ""
  );
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
  const { cipher, verifier } = useAuth();
  const location = useLocation();
  if ((!verifier || verifier === "") && location.pathname !== "/") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if ((!cipher || cipher === "") && location.pathname !== "/login") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};
