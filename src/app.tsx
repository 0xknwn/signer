import { Routes, Route } from "react-router";
import Signin from "./routes/signin";
import More from "./routes/more";
import Accounts from "./routes/accounts";
import Transactions from "./routes/transactions";
import Notifier from "./routes/notifier";
import { AuthProvider, ProtectedRoute } from "./helpers/authn";
import Login from "./routes/login";
import Seed from "./routes/seed";
import NoMatch from "./routes/404";
import Setup from "./routes/accounts/setup";
import Tokens from "./routes/accounts/tokens";
import History from "./routes/accounts/history";
import Messages from "./routes/notifier/messages";
import Channels from "./routes/accounts/channels";
import NewChannel from "./routes/accounts/channel_tabs/new";
import ChannelList from "./routes/accounts/channel_tabs/list";
import Faucet from "./routes/more/faucet";
import Classes from "./routes/more/classes";
import Contracts from "./routes/more/contracts";
import Calls from "./routes/more/calls";
import { AccountsProvider } from "./helpers/accounts";
import { classNames as helpersClassNames } from "@0xknwn/starknet-test-helpers";
import { PollingProvider } from "./helpers/polling";

export const App = () => {
  return (
    <AuthProvider>
      <PollingProvider>
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
                path="channels"
                element={
                  <ProtectedRoute>
                    <Channels />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <NewChannel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="new"
                  element={
                    <ProtectedRoute>
                      <NewChannel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="list"
                  element={
                    <ProtectedRoute>
                      <ChannelList />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NoMatch />} />
              </Route>
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
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NoMatch />} />
            </Route>
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
                <Route
                  path="calls"
                  element={
                    <ProtectedRoute>
                      <Calls name={helpersClassNames.Counter} />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NoMatch />} />
              </Route>
            )}
          </Routes>
        </AccountsProvider>
      </PollingProvider>
    </AuthProvider>
  );
};

export default App;
