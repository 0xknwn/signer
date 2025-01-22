import { NavLink } from "react-router";
import "./Navbar.css";
import { useLocation, Link } from "react-router";
import { useAuth } from "../helpers/authn";

function Navbar() {
  const location = useLocation();
  const { token, onLogout } = useAuth();
  return (
    <>
      <nav>
        {token ? (
          <>
            <Link className="tab" to="/login" state={{ from: location }}>
              Login
            </Link>
            <Link className="tab" to="/seed" state={{ from: location }}>
              Seed
            </Link>
          </>
        ) : (
          <Link className="tab" to="/" state={{ from: location }}>
            Signin
          </Link>
        )}
        <NavLink className="tab" to="/accounts" state={{ from: location }} end>
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
        <NavLink className="tab" to="/notifier" state={{ from: location }} end>
          Notifier
        </NavLink>
        <NavLink className="tab" to="/messages" state={{ from: location }} end>
          Messages
        </NavLink>
        <NavLink className="tab" to="/logout" state={{ from: location }} end>
          Logout
        </NavLink>
        <NavLink className="tab" to="/about" state={{ from: location }} end>
          About
        </NavLink>
        {token && (
          <button type="button" onClick={onLogout}>
            Sign Out
          </button>
        )}
      </nav>
    </>
  );
}

export default Navbar;
