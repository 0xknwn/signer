import { useAuth } from "../helpers/authn";
import Navbar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { derive } from "../helpers/encryption";
import { content } from "./login.help";
import { store } from "../helpers/store";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cipher, verify } = useAuth();

  const [warning, setWarning] = useState(false);
  const [help, setHelp] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem(store.username) || ""
  );
  const setAndSaveUsername = (value: string) => {
    localStorage.setItem(store.username, value);
    setUsername(value);
  };
  const [password, setPassword] = useState("");
  const login = async () => {
    const { encrypter } = await derive(username, password);
    try {
      const checked = await verify(encrypter);
      if (!checked) {
        setWarning(true);
        setTimeout(() => {
          setWarning(false);
        }, 3000);
      }
    } catch (e) {
      setWarning(true);
      setTimeout(() => {
        setWarning(false);
      }, 3000);
    }
  };
  useEffect(() => {
    if (cipher) {
      const origin = location.state?.from?.pathname || "/accounts";
      navigate(origin);
    }
  }, [cipher]);

  return (
    <>
      <Navbar />
      <h2>Login</h2>
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
            onChange={(e) => setAndSaveUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={login}>
            LogIn
          </button>
          {warning && <p>Invalid username or password</p>}
          {import.meta.env.MODE === "development" && <p>development</p>}
        </>
      )}
    </>
  );
};

export default Login;
