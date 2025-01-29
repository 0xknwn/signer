import { useAccounts } from "../../helpers/accounts";

function History() {
  const { accounts, selectedAccountNumber } = useAccounts();
  return (
    <>
      {accounts && accounts.length > 0 && (
        <div>
          <p>Address: {accounts[selectedAccountNumber].address}</p>
          <p>Public key: {accounts[selectedAccountNumber].publickey}</p>
        </div>
      )}
      <p>Here you can see the account transaction history</p>
    </>
  );
}

export default History;
