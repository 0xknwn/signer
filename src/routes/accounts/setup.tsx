import { useAccounts, type account } from "../../helpers/accounts";
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
            <p>Address: {accounts[selectedAccountNumber].address}</p>
            <p>Public key: {accounts[selectedAccountNumber].publickey}</p>
          </div>
        </>
      ) : (
        <p>No accounts</p>
      )}
    </>
  );
}

export default Setup;
