import { Routes, Route } from "react-router";
import Signin from "./routes/signin.tsx";
import About from "./routes/about.tsx";
import Logout from "./routes/logout.tsx";
import Accounts from "./routes/accounts.tsx";
import Transactions from "./routes/transactions.tsx";
import Messages from "./routes/messages.tsx";
import Notifier from "./routes/notifier.tsx";
import { AuthProvider, ProtectedRoute } from "./helpers/authn.tsx";
import Login from "./routes/login.tsx";
import Seed from "./routes/seed.tsx";
import NoMatch from "./routes/404.tsx";

export const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<Signin />} />
        <Route
          path="login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="seed"
          element={
            <ProtectedRoute>
              <Seed />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NoMatch />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="notifier" element={<Notifier />} />
        <Route path="messages" element={<Messages />} />
        <Route path="logout" element={<Logout />} />
        <Route path="about" element={<About />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
