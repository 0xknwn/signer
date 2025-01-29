import { useAccounts } from "../../helpers/accounts";

function Tokens() {
  const { accounts, selectedAccountNumber } = useAccounts();
  return (
    <>
      {accounts && accounts.length > 0 && (
        <div>
          <p>Address: {accounts[selectedAccountNumber].address}</p>
          <p>Public key: {accounts[selectedAccountNumber].publickey}</p>
        </div>
      )}
      <p>Here you can see tokens</p>
    </>
  );
}

export default Tokens;
