import { useContext } from "react";
import { Navigate, Routes as Router, Route, Outlet } from "react-router-dom";
import { AuthContext } from "./authContext";
import { Home } from "./home";
import { Login } from "./login";

const PrivateRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const Routes = () => {
  return (
    <Router>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Router>
  );
};
