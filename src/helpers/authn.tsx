import { useContext, createContext } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { useState, useEffect } from "react";

export const AuthContext = createContext<{
  challenge: string;
  verifier: string;
  setVerifier: (value: string) => void;
  token: string;
  onLogin: () => void;
  onLogout: () => void;
}>({
  challenge: "",
  token: "",
  verifier: "",
  setVerifier: () => {},
  onLogin: () => {},
  onLogout: () => {},
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
  const location = useLocation();
  const [token, setToken] = useState(
    localStorage.getItem("smartr-token") ?? ""
  );
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

  useEffect(() => {
    if (token && token !== "") {
      localStorage.setItem("smartr-token", token);
      return;
    }
    localStorage.removeItem("smartr-token");
  }, [token]);

  useEffect(() => {
    if (!challenge || challenge === "") {
      const id = self.crypto.randomUUID();
      localStorage.setItem(store.challenge, id);
      setChallenge(id);
      return;
    }
  }, []);

  const handleLogin = async () => {
    const token = await fakeAuth();
    setToken(token);
    const origin = location.state?.from?.pathname || "/login";
    navigate(origin);
  };

  const handleLogout = () => {
    setToken("");
  };

  const value = {
    challenge,
    verifier,
    setVerifier,
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};
