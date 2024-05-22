import { Routes } from "./routes/routes";
import { Authn, type Credentials, type AccessToken } from "./context/authn.tsx";
import { useState } from "react";

const emptyCredentials = {
  accessToken: null as AccessToken | null,
  derivedKey0: null as string | null,
  email: null as string | null,
} as Credentials;

const App = ({
  mockCredentials = false,
}: {
  mockCredentials: false | Credentials;
}) => {
  const [credentials, setCredentials] = useState(
    mockCredentials ? mockCredentials : emptyCredentials
  );
  return (
    <Authn.Provider value={{ credentials, setCredentials }}>
      <Routes />
    </Authn.Provider>
  );
};

App.defaultProps = {
  mockCredentials: false,
};

export { App };
