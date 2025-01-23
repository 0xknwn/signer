import { useContext } from "react";
import { Authn } from "../context/authn";
import { Link } from "react-router-dom";

export const Accounts = () => {
  const { setCredentials } = useContext(Authn);
  const logout = () => {
    setCredentials({});
  };

  return (
    <>
      <Link to="#" onClick={logout}>
        Logout
      </Link>
      <h1>Route: /</h1>
    </>
  );
};
