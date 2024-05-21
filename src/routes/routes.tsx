import { useContext } from "react";
import {
  Navigate,
  Routes as Router,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Authn } from "../context/authn.tsx";
// import { Home } from "./home";
import { ErrorPage } from "../error-page.tsx";

import { Accounts } from "./accounts.tsx";
import { Signin } from "./signin.tsx";
import { Signup } from "./signup.tsx";
import { Verify } from "./verify.tsx";
import { Onboard } from "./onboard.tsx";

const PrivateRoutes = () => {
  const location = useLocation();
  const { credentials } = useContext(Authn);
  // @todo: if you have what is required and are on /onboard or /verify, go to /
  return (credentials?.accessToken?.key &&
    credentials.accessToken.expiresAt &&
    credentials.accessToken.expiresAt > Date.now() &&
    (credentials.managedAccounts || location.pathname === "/onboard")) ||
    (credentials?.derivedKey0 && location.pathname === "/verify") ? (
    <Outlet />
  ) : credentials?.accessToken?.key &&
    credentials.accessToken.expiresAt &&
    credentials.accessToken.expiresAt > Date.now() &&
    !credentials.managedAccounts ? (
    <Navigate to="/onboard" replace />
  ) : credentials?.derivedKey0 ? (
    <Navigate to="/verify" replace />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export const Routes = () => {
  return (
    <Router>
      <Route element={<PrivateRoutes />} errorElement={<ErrorPage />}>
        <Route path="/" element={<Accounts />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/onboard" element={<Onboard />} />
      </Route>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Router>
  );
};
