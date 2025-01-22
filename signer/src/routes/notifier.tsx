import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

const content = `
The application should provide a notifier section where you can find
informations about the fact that a transaction has succeeded or failed. Those
informations can be acknowledged like in a mailbox.
`;

function Notifier() {
  const [help, setHelp] = useState(false);

  const activateLasers = () => {
    setHelp(!help);
  };

  return (
    <>
      <NavBar />
      <h1>Notifier</h1>
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

export default Notifier;
