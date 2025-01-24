import NavBar from "../components/navbar";
import { useAuth } from "../helpers/authn";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

import { content } from "./signin.help";

function Signin() {
  const { onLogin } = useAuth();
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("signin");
    if (token) {
      console.log(location.state);
      const origin = location.state?.from?.pathname || "/dashboard";
      navigate(origin);
    }
  }, []);

  const [help, setHelp] = useState(false);

  const activateLasers = () => {
    setHelp(!help);
  };

  return (
    <>
      <NavBar />
      <h1>Signin</h1>
      <button onClick={activateLasers}>
        {help ? "Hide help" : "Show help"}
      </button>
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        <>
          <input type="text" placeholder="username" />
          <input type="password" placeholder="password" />
          <input type="password" placeholder="confirm" />
          <button type="button" onClick={onLogin}>
            Sign In
          </button>
        </>
      )}
    </>
  );
}

export default Signin;
