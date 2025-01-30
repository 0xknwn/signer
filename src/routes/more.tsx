import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useState } from "react";
import { content } from "./more.help";
import { NavLink, Outlet } from "react-router";

function More() {
  const [help, setHelp] = useState(false);

  return (
    <>
      <NavBar />
      <h1>More</h1>
      <button
        onClick={() => {
          setHelp(!help);
        }}
      >
        {help ? "Hide help" : "Show help"}
      </button>
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        <>
          <nav>
            <NavLink className="tab" to="faucet">
              Faucet
            </NavLink>
            <NavLink className="tab" to="classes">
              Classes
            </NavLink>
            <NavLink className="tab" to="contracts">
              Contracts
            </NavLink>
            <NavLink className="tab" to="calls">
              Calls
            </NavLink>
          </nav>
          <Outlet />
        </>
      )}
    </>
  );
}

export default More;
