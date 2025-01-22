import { useContext, createContext } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import { useState, useEffect } from "react";

export const AuthContext = createContext<{
  token: string;
  onLogin: () => void;
  onLogout: () => void;
}>({
  token: "",
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

const loadTokenFromLocalStorage = () => {
  const init = localStorage.getItem("smartr-token");
  return init ?? "";
};

const saveTokenToLocalStorage = (token: string) => {
  localStorage.setItem("smartr-token", token);
};

const resetTokenFromLocalStorage = () => {
  localStorage.removeItem("smartr-token");
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(loadTokenFromLocalStorage());

  useEffect(() => {
    if (token && token !== "") {
      saveTokenToLocalStorage(token);
      return;
    }
    resetTokenFromLocalStorage();
  }, [token]);

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
