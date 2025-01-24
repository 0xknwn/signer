import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

import { content } from "./more.help";

function More() {
  const [help, setHelp] = useState(false);

  const activateLasers = () => {
    setHelp(!help);
  };

  return (
    <>
      <NavBar />
      <h1>More</h1>
      <button onClick={activateLasers}>
        {help ? "Hide help" : "Show help"}
      </button>
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        "Oops! This page is under construction."
      )}
    </>
  );
}

export default More;
