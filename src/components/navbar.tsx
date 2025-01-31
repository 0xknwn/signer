import { useLocation, NavLink } from "react-router";
import "./navbar.css";
import { useAuth } from "../helpers/authn_context";

function Navbar() {
  const location = useLocation();
  const { verifier, resetWallet, verify, cipher, passphrase } = useAuth();
  const logout = async () => {
    await verify(null);
  };
  return (
    <>
      <nav>
        {verifier ? (
          cipher ? (
            <>
              <NavLink
                className="tab"
                to="/seed"
                state={{ from: location }}
                end
              >
                Seed
              </NavLink>
              {passphrase && (
                <>
                  <NavLink
                    className="tab"
                    to="/accounts"
                    state={{ from: location }}
                  >
                    Accounts
                  </NavLink>
                  <NavLink
                    className="tab"
                    to="/transactions"
                    state={{ from: location }}
                    end
                  >
                    Transactions
                  </NavLink>
                  <NavLink
                    className="tab"
                    to="/notifier"
                    state={{ from: location }}
                    end
                  >
                    Notifier
                  </NavLink>
                  {import.meta.env.MODE === "development" && (
                    <NavLink
                      className="tab"
                      to="/more"
                      state={{ from: location }}
                    >
                      More...
                    </NavLink>
                  )}
                </>
              )}
              <button type="button" onClick={logout}>
                Logout
              </button>{" "}
            </>
          ) : (
            <>
              <NavLink
                className="tab"
                to="/login"
                state={{ from: location }}
                end
              >
                Login
              </NavLink>
              <button type="button" onClick={resetWallet}>
                Reset Wallet
              </button>
            </>
          )
        ) : (
          <NavLink className="tab" to="/" state={{ from: location }} end>
            Signin
          </NavLink>
        )}
      </nav>
    </>
  );
}

export default Navbar;
