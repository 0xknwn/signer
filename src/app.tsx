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
import Setup from "./routes/accounts/setup.tsx";
import Tokens from "./routes/accounts/tokens.tsx";
import History from "./routes/accounts/history.tsx";
import Faucet from "./routes/more/faucet.tsx";
import Classes from "./routes/more/classes.tsx";
import Contracts from "./routes/more/contracts.tsx";
import { AccountsProvider } from "./helpers/accounts.tsx";

export const App = () => {
  return (
    <AuthProvider>
      <AccountsProvider>
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
          >
            <Route
              index
              element={
                <ProtectedRoute>
                  <Setup />
                </ProtectedRoute>
              }
            />
            <Route
              path="setup"
              element={
                <ProtectedRoute>
                  <Setup />
                </ProtectedRoute>
              }
            />
            <Route
              path="tokens"
              element={
                <ProtectedRoute>
                  <Tokens />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />{" "}
            <Route path="*" element={<NoMatch />} />
          </Route>
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
          {import.meta.env.MODE === "development" && (
            <Route
              path="more"
              element={
                <ProtectedRoute>
                  <More />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Faucet />
                  </ProtectedRoute>
                }
              />
              <Route
                path="faucet"
                element={
                  <ProtectedRoute>
                    <Faucet />
                  </ProtectedRoute>
                }
              />
              <Route
                path="classes"
                element={
                  <ProtectedRoute>
                    <Classes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="contracts"
                element={
                  <ProtectedRoute>
                    <Contracts />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NoMatch />} />
            </Route>
          )}
        </Routes>
      </AccountsProvider>
    </AuthProvider>
  );
};

export default App;
