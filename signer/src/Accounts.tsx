import NavBar from "./Navbar";

function Logout() {
  return (
    <>
      <NavBar />
      <h1>Networks and Accounts</h1>
      <h2>Networks</h2>
      <p>
        Networks can be configured to be accessed from the signer. It should
        come with 3 separate configurations that include default values for:
      </p>
      <ul>
        <li>Name</li>
        <li>RPC URL</li>
        <li>Chain ID</li>
        <li>Token Address</li>
        <li>Token Name</li>
      </ul>
      <p>
        We should be able to add a network, edit a network and delete a network.
      </p>
      <h2>Accounts</h2>
      <ul>
        <li>
          We should be able to generate an account from the Network, the
          passphrase, i.e. salt and the class hash.{" "}
        </li>
        <li>Network (Cannot be changed)</li>
        <li>Name</li>
        <li>Address (Cannot be changed)</li>
        <li>Jazzicon (Cannot be changed)</li>
        <li>Private Key</li>
        <li>Public Key</li>
        <p>
          We should also be able to import an existing account. When that is the
          case, the private keys as well as the address should be secured with
          the login. In addition, once an account has been created, we should be
          able to perform a number of operations with this account. Those
          operations are listed below.
        </p>
      </ul>
      <h3>Manage Tokens</h3>
      <p>
        We should be able to view, for an account the position in ETH and STRK
        at least for now. In addition, we should be able to get a QR code with
        the account address to help user fund it from another wallet.
      </p>
      <h3>Deploy the account</h3>
      <p>
        By default, even if the account has everything precomputed, it cannot be
        used. The reason is it needs to be deployed first and to be deployed, it
        needs to be funded with STRK. We should be able to deploy the account
        from the UI.
      </p>
      <h3>Authorized Dapps</h3>
      <p>
        We should be able to add Add domain to the account that are activated.
        This is a prerequisites for the account to be able to interact with the
        Dapps. As a result, autorized Dapps are just protocol/domains. The user
        can remove those.
      </p>
      <h3>Transaction history</h3>
      <p>
        This section should keep the history of succeeded and failed
        transactions associated with the account. For details, see the
        "Transactions &gt; Report the Transaction" section of this document.
      </p>
    </>
  );
}

export default Logout;
