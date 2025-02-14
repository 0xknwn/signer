import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { content } from "./accounts.help";

function Account() {
  const [help, setHelp] = useState(false);
  return (
    <>
      <NavBar />
      <button
        onClick={() => {
          setHelp(!help);
        }}
      >
        {help ? "Hide help" : "Show help"}
      </button>
      <h1>Networks and Accounts</h1>
      {help ? (
        <>
          <Markdown>{content}</Markdown>
        </>
      ) : (
        <>
          <nav>
            <NavLink className="tab" to="setup">
              Setup
            </NavLink>
            <NavLink className="tab" to="tokens">
              Tokens
            </NavLink>
            <NavLink className="tab" to="applications">
              Dapps
            </NavLink>
            <NavLink className="tab" to="history">
              History
            </NavLink>
          </nav>
          <Outlet />
        </>
      )}
    </>
  );
}

export default Account;
