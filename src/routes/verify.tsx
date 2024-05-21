import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { Authn } from "../context/authn.tsx";
import { useNavigate } from "react-router-dom";

export const Verify = () => {
  const { credentials, setCredentials } = useContext(Authn);
  const navigate = useNavigate();

  const [status, setStatus] = useState(0);

  const handleClick = async () => {
    const res = await fetch("/api/verify", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: "a@b.c",
        verification_key: "123",
      }),
    });
    if (res.status === 200) {
      console.log("Success");
      setStatus(200);
    } else if (res.status === 401) {
      console.log("Unauthorized");
      setStatus(401);
    } else {
      console.log("Bad Request");
      setStatus(400);
    }
  };

  useEffect(() => {
    if (status === 0) {
      return;
    }
    if (status === 200) {
      setCredentials({
        ...credentials,
        accessToken: { key: "1", expiresAt: Date.now() + 3600 },
      });
      navigate("/", { replace: true });
      return;
    }
    setCredentials({
      ...credentials,
      derivedKey0: null,
    });
    console.log("Verify has somehow failed.");
  }, [status]);

  return (
    <>
      <Link to="/">back</Link>
      <h1>Verify: /verify</h1>
      <form>
        <label>
          Verification Code :
          <input type="text" />
        </label>
        <input
          type="button"
          onClick={handleClick}
          name="verify"
          value="verify"
        />
        <div hidden>{status}</div>
      </form>
    </>
  );
};
