import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useState } from "react";
import { Link, Outlet } from "react-router";
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
        <Markdown>{content}</Markdown>
      ) : (
        <>
          <nav>
            <Link className="tab" to="setup">
              Setup
            </Link>
            <Link className="tab" to="tokens">
              Tokens
            </Link>
            <Link className="tab" to="history">
              History
            </Link>
          </nav>
          <Outlet />
        </>
      )}
    </>
  );
}

export default Account;
