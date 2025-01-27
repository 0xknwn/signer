import NavBar from "../components/navbar";
import { useAuth } from "../helpers/authn";
import { derive, encrypt } from "../helpers/encryption";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

import { content } from "./signin.help";

function Signin() {
  const { challenge, verifier, setVerifier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const log = async () => {
    if (password !== confirm) {
      return;
    }
    const { encrypter } = await derive(username, password);
    const output = await encrypt(encrypter, challenge);
    setVerifier(output);
  };

  useEffect(() => {
    if (verifier && verifier !== "") {
      const origin = location.state?.from?.pathname || "/login";
      navigate(origin);
    }
  }, []);

  useEffect(() => {
    if (verifier && verifier !== "") {
      const origin = location.state?.from?.pathname || "/login";
      navigate(origin);
    }
  }, [verifier]);

  const [help, setHelp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <>
      <NavBar />
      <h1>Signin</h1>
      <button
        onClick={() => {
          setHelp(!help);
        }}
      >
        {help ? "Hide help" : "Show help"}
      </button>
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        <>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button type="button" onClick={log}>
            Sign In
          </button>
          <p>{password === confirm ? "" : "passwords must match..."}</p>
        </>
      )}
    </>
  );
}

export default Signin;
