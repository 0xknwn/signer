import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

import { content } from "./logout.help";

function Logout() {
  const [help, setHelp] = useState(false);

  const activateLasers = () => {
    setHelp(!help);
  };

  return (
    <>
      <NavBar />
      <h1>Logout</h1>
      <button onClick={activateLasers}>
        {help ? "Hide help" : "Show help"}
      </button>{" "}
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        <p>"Oops! This page is under construction."</p>
      )}
    </>
  );
}

export default Logout;
