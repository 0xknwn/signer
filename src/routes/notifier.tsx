import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";

import { content } from "./notifier.help";

import { useState } from "react";
import { NavLink, Outlet } from "react-router";

function Notifier() {
  const [help, setHelp] = useState(false);
  return (
    <>
      <NavBar />
      <h1>Notifier</h1>
      <button
        onClick={() => {
          setHelp(!help);
        }}
      >
        {help ? "Hide help" : "Show help"}
      </button>
      {help ? (
        <>
          <Markdown>{content}</Markdown>
        </>
      ) : (
        <>
          <nav>
            <NavLink className="tab" to="messages">
              Messages
            </NavLink>
            <NavLink className="tab" to="applications">
              Applications
            </NavLink>
          </nav>
          <Outlet />
        </>
      )}
    </>
  );
}

export default Notifier;
