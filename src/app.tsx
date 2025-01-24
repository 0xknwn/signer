import { Routes, Route } from "react-router";
import Signin from "./routes/signin.tsx";
import More from "./routes/more.tsx";
import Accounts from "./routes/accounts.tsx";
import Transactions from "./routes/transactions.tsx";
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
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NoMatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifier"
          element={
            <ProtectedRoute>
              <Notifier />
            </ProtectedRoute>
          }
        />
        <Route
          path="more"
          element={
            <ProtectedRoute>
              <More />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
