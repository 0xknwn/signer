import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";

import { content } from "./notifier.help";

import { useState } from "react";
import NotificationList from "../components/notification_list";

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
      {help ? <Markdown>{content}</Markdown> : <NotificationList />}
    </>
  );
}

export default Notifier;
