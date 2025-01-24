import { NavLink } from "react-router";
import "./navbar.css";
import { useLocation, Link } from "react-router";
import { useAuth } from "../helpers/authn";

function Navbar() {
  const location = useLocation();
  const { verifier, resetWallet, verify, cipher } = useAuth();
  const logout = () => {
    verify("");
  };
  return (
    <>
      <nav>
        {verifier ? (
          cipher ? (
            <>
              <Link className="tab" to="/seed" state={{ from: location }}>
                Seed
              </Link>
              <NavLink
                className="tab"
                to="/accounts"
                state={{ from: location }}
                end
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
              <NavLink
                className="tab"
                to="/logout"
                state={{ from: location }}
                end
              >
                Logout
              </NavLink>
              <NavLink
                className="tab"
                to="/more"
                state={{ from: location }}
                end
              >
                More...
              </NavLink>
              <button type="button" onClick={logout}>
                Logout
              </button>
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
