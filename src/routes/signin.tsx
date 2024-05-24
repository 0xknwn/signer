import { Link } from "react-router-dom";

import { useContext } from "react";
import { Authn } from "../context/authn.tsx";
import { useNavigate } from "react-router-dom";
import { derive } from "../helpers/encryption";

export const Signin = () => {
  const { credentials, setCredentials } = useContext(Authn);
  const navigate = useNavigate();

  const handleClick = async () => {
    let { signer, encrypter } = await derive("a@b.c", "123");
    setCredentials({ ...credentials, email: "a@b.c", signer, encrypter });
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
