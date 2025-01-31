import { useAccounts } from "../helpers/account_context";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const Account = () => {
  const { accounts, selectedAccountNumber } = useAccounts();

  return (
    <>
      {accounts.length > 0 && selectedAccountNumber < accounts.length ? (
        <>
          <div>
            Address:{" "}
            <Jazzicon
              diameter={32}
              seed={jsNumberForAddress(accounts[selectedAccountNumber].address)}
            />{" "}
            {accounts[selectedAccountNumber].address.substring(0, 6) +
              "..." +
              accounts[selectedAccountNumber].address.substring(
                accounts[selectedAccountNumber].address.length - 4,
                accounts[selectedAccountNumber].address.length
              )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  accounts[selectedAccountNumber].address
                );
              }}
            >
              Copy
            </button>
          </div>
          <div>
            Public key:{" "}
            {accounts[selectedAccountNumber].publickey.substring(0, 6) +
              "..." +
              accounts[selectedAccountNumber].publickey.substring(
                accounts[selectedAccountNumber].publickey.length - 4,
                accounts[selectedAccountNumber].publickey.length
              )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  accounts[selectedAccountNumber].publickey
                );
              }}
            >
              Copy
            </button>
          </div>
        </>
      ) : (
        <p>No accounts Selected</p>
      )}
    </>
  );
};

export default Account;
