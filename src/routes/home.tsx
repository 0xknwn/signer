import { useContext } from "react";
import { AuthContext } from "./authContext";

export const Home = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => setIsAuthenticated(false)}>Logout</button>
    </div>
  );
};
