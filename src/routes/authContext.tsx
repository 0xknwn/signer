import { createContext, ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticate: boolean) => void;
};

const initialAuthContext: AuthContextType = {
  isAuthenticated: false,
  setIsAuthenticated: (_: boolean) => {},
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

export const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
