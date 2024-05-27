import { useContext, useEffect, useState } from "react";
import { Navigate, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Authn, type Credentials } from "../context/authn.tsx";
import { ErrorPage } from "../error-page.tsx";

import { Accounts } from "./accounts.tsx";
import { Signin } from "./signin.tsx";
import { Signup } from "./signup.tsx";
import { Verify } from "./verify.tsx";
import { Onboard } from "./onboard.tsx";

const PrivateRoutes = () => {
  const location = useLocation();
  const { credentials, setCredentials } = useContext(Authn);

  useEffect(() => {
    if (
      credentials.accessToken?.expiresAt &&
      credentials.accessToken.expiresAt < Date.now()
    ) {
      setCredentials({});
    }
  }, [credentials]);

  return credentials?.accessToken?.key &&
    credentials.accessToken.expiresAt &&
    credentials.accessToken.expiresAt > Date.now() &&
    credentials.managedAccounts &&
    (location.pathname === "/onboard" || location.pathname === "/verify") ? (
    <Navigate to="/" replace />
  ) : credentials?.accessToken?.key &&
    credentials.accessToken.expiresAt &&
    credentials.accessToken.expiresAt > Date.now() &&
    credentials.managedAccounts &&
    location.pathname !== "/onboard" &&
    location.pathname !== "/verify" ? (
    <Outlet />
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
    (credentials?.signer && location.pathname === "/verify") ? (
    <Outlet />
  ) : credentials?.signer && credentials.email ? (
    <Navigate to="/verify" replace />
  ) : (
    <Navigate to="/signin" replace />
  );
};

const emptyCredentials = {} as Credentials;

const AppRouter = ({
  mockCredentials = false,
}: {
  mockCredentials?: false | Credentials;
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

export { AppRouter };
