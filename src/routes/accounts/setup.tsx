import { useAccounts, type account } from "../../helpers/accounts";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
function Setup() {
  const {
    accounts,
    addAccount,
    selectedAccountNumber,
    setSelectedAccountNumber,
  } = useAccounts();

  const handleOnChange = (value: string) => {
    setSelectedAccountNumber(parseInt(value));
  };

  const add = async () => {
    const i = accounts.length;
    await addAccount();
    setSelectedAccountNumber(i);
  };

  return (
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
            <div>
              Address:{" "}
              <Jazzicon
                diameter={32}
                seed={jsNumberForAddress(
                  accounts[selectedAccountNumber].address
                )}
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
          </div>
        </>
      ) : (
        <p>No accounts</p>
      )}
    </>
  );
}

export default Setup;
