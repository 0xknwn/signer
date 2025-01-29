import { useAccounts } from "../../helpers/accounts";

function Tokens() {
  const { accounts, selectedAccountNumber, tokens, refreshTokens } =
    useAccounts();
  return (
    <>
      {accounts && accounts.length > 0 && (
        <div>
          <p>Address: {accounts[selectedAccountNumber].address}</p>
          <p>Public key: {accounts[selectedAccountNumber].publickey}</p>
        </div>
      )}
      <h2>Tokens</h2>
      <button onClick={refreshTokens}>Refresh</button>
      {tokens.map((token) => (
        <div key={token.address}>
          {token.name}: {token.value}
        </div>
      ))}
    </>
  );
}

export default Tokens;
