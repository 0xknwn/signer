import { NavLink } from "react-router";
import "./Navbar.css";

function Navbar() {
  return (
    <>
      <nav>
        <NavLink className="tab" to="/" end>
          Signin
        </NavLink>
        <NavLink className="tab" to="/accounts" end>
          Accounts
        </NavLink>
        <NavLink className="tab" to="/transactions" end>
          Transactions
        </NavLink>
        <NavLink className="tab" to="/notifier" end>
          Notifier
        </NavLink>
        <NavLink className="tab" to="/messages" end>
          Messages
        </NavLink>
        <NavLink className="tab" to="/logout" end>
          Logout
        </NavLink>
        <NavLink className="tab" to="/about" end>
          About
        </NavLink>
      </nav>
    </>
  );
}

export default Navbar;
