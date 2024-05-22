import { useContext, useState } from "react";
import { Navigate, Routes, Route, Outlet, useLocation } from "react-router-dom";
import {
  Authn,
  type Credentials,
  type AccessToken,
} from "../context/authn.tsx";
import { ErrorPage } from "../error-page.tsx";

import { Accounts } from "./accounts.tsx";
import { Signin } from "./signin.tsx";
import { Signup } from "./signup.tsx";
import { Verify } from "./verify.tsx";
import { Onboard } from "./onboard.tsx";

const PrivateRoutes = () => {
  const location = useLocation();
  const { credentials } = useContext(Authn);

  return credentials?.accessToken?.key &&
    credentials.accessToken.expiresAt &&
    credentials.accessToken.expiresAt > Date.now() &&
    credentials.managedAccounts &&
    (location.pathname === "/onboard" || location.pathname === "/verify") ? (
    <Navigate to="/" replace />
  ) : credentials?.accessToken?.key &&
    credentials.accessToken.expiresAt &&
    credentials.accessToken.expiresAt > Date.now() &&
    !credentials.managedAccounts &&
    location.pathname === "/verify" ? (
    <Navigate to="/onboard" replace />
  ) : (credentials?.accessToken?.key &&
      credentials.accessToken.expiresAt &&
      credentials.accessToken.expiresAt > Date.now() &&
      (credentials.managedAccounts || location.pathname === "/onboard")) ||
    (credentials?.derivedKey0 && location.pathname === "/verify") ? (
    <Outlet />
  ) : credentials?.derivedKey0 && credentials.email ? (
    <Navigate to="/verify" replace />
  ) : (
    <Navigate to="/signin" replace />
  );
};

const emptyCredentials = {
  accessToken: null as AccessToken | null,
  derivedKey0: null as string | null,
  email: null as string | null,
} as Credentials;

const AppRouter = ({
  mockCredentials = false,
}: {
  mockCredentials: false | Credentials;
}) => {
  const [credentials, setCredentials] = useState(
    mockCredentials ? mockCredentials : emptyCredentials
  );

  return (
    <Authn.Provider value={{ credentials, setCredentials }}>
      <Routes>
        <Route element={<PrivateRoutes />} errorElement={<ErrorPage />}>
          <Route path="/" element={<Accounts />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/onboard" element={<Onboard />} />
        </Route>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Authn.Provider>
  );
};

AppRouter.defaultProps = {
  mockCredentials: false,
};

export { AppRouter };
