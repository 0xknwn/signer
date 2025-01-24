import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

import { content } from "./accounts.help";

function Account() {
  const [help, setHelp] = useState(false);
  return (
    <>
      <NavBar />
      <button onClick={() => {
          setHelp(!help);
        }}>
        {help ? "Hide help" : "Show help"}
      </button>
      <h1>Networks and Accounts</h1>
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        "Oops! This page is under construction."
      )}
    </>
  );
}

export default Account;
