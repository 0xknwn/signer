import { useAuth } from "../helpers/authn.tsx";
import Navbar from "../components/navbar.tsx";

const Login = () => {
  const { token } = useAuth();

  return (
    <>
      <Navbar />
      <h2>Login (Protected)</h2>

      <div>Authenticated as {token}</div>
    </>
  );
};

export default Login;
