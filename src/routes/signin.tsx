import { Link } from "react-router-dom";

import { useContext } from "react";
import { Authn } from "../context/authn.tsx";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const { credentials, setCredentials } = useContext(Authn);
  const navigate = useNavigate();

  const handleClick = () => {
    setCredentials({ ...credentials, email: "a@b.c", derivedKey0: "123" });
    navigate("/", { replace: true });
  };

  return (
    <>
      <Link to="/">back</Link>, no account? <Link to="/signup">signup</Link>
      <h1>Signin: /signin</h1>
      <form>
        <label>
          Email:
          <input type="email" autoComplete="username" name="username" />
        </label>

        <label>
          Password:
          <input
            type="password"
            autoComplete="current-password"
            name="password"
          />
        </label>
        <input type="button" onClick={handleClick} value="submit" />
      </form>
    </>
  );
};
