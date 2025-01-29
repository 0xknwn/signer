import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";

import { content } from "./accounts.help";
import { useAuth, type account } from "../helpers/authn";

function Account() {
  const { getAccounts, addAccount } = useAuth();
  const [help, setHelp] = useState(false);
  const [accounts, setAccounts] = useState([] as account[]);

  useEffect(() => {
    getAccounts().then((accounts) => {
      setAccounts(accounts);
    });
  }, []);

  const [selectedAccountNumber, setSelectedAccountNumber] = useState(0);

  const handleOnChange = (value: string) => {
    setSelectedAccountNumber(parseInt(value));
  };

  const add = async () => {
    const account = await addAccount();
    if (account) {
      setAccounts([...accounts, account]);
    }
  };

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
          <button onClick={add}>Add account</button>
          {accounts.length > 0 && selectedAccountNumber < accounts.length ? (
            <>
              <select
                onChange={(e) => handleOnChange(e.currentTarget.value)}
                value={selectedAccountNumber}
              >
                {accounts.map((a: account, index: number) => (
                  <option key={index} value={index}>
                    {a.name}
                  </option>
                ))}
              </select>
              <div>
                <p>Address: {accounts[selectedAccountNumber].address}</p>
                <p>Public key: {accounts[selectedAccountNumber].publickey}</p>
              </div>
            </>
          ) : (
            <div>No Accounts</div>
          )}
        </>
      )}
    </>
  );
}

export default Account;
