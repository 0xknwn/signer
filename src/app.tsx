import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes/routes";
import { AuthProvider } from "./routes/authContext";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
};
