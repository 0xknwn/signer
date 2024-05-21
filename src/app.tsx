import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes/routes";
import { Authn, type Credentials, type AccessToken } from "./context/authn.tsx";
import { useState } from "react";

const initialCredentials = {
  accessToken: null as AccessToken | null,
  derivedKey0: null as string | null,
  email: null as string | null,
} as Credentials;

export const App = () => {
  const [credentials, setCredentials] = useState(initialCredentials);

  return (
    <BrowserRouter>
      <Authn.Provider value={{ credentials, setCredentials }}>
        <Routes />
      </Authn.Provider>
    </BrowserRouter>
  );
};
