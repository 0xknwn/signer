import { useContext } from "react";
import { AuthContext } from "./authContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/", { replace: true });
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => handleLogin()}>Authenticate</button>
    </div>
  );
};
