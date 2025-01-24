import { useAuth } from "../helpers/authn.tsx";
import Navbar from "../components/navbar.tsx";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

import { content } from "./login.help";

const Login = () => {
  const { token } = useAuth();

  const [help, setHelp] = useState(false);

  const activateLasers = () => {
    setHelp(!help);
  };

  return (
    <>
      <Navbar />
      <h2>Login (Protected)</h2>
      <button onClick={activateLasers}>
        {help ? "Hide help" : "Show help"}
      </button>
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        <div>Authenticated as {token}</div>
      )}
    </>
  );
};

export default Login;
