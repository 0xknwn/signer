import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

import { content } from "./transactions.help";

function Transactions() {
  const [help, setHelp] = useState(false);

  return (
    <>
      <NavBar />
      <h1>Transactions</h1>
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
        "Oops! This page is under construction."
      )}
    </>
  );
}

export default Transactions;
