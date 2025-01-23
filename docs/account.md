# Networks and Accounts

## Networks

Networks can be configured to be accessed from the signer. It should come with 3
separate configurations that include default values for:

- **Name**: By default, there are 3 networks that are Mainnet, Testnet and
  Devnet. To begin with, we should only provide the devnet.
- **RPC URL**: the default for Mainnet and Testnet will be provided later; the
  default for Devnet is http://localhost:5050/rpc. It is
- **Chain ID**: the default values are the following Mainnet: SN_MAINNET;
  Testnet/Devnet: SN_SEPOLIA
- **Token Name**: the default is STRK
- **Token Address**: the default is
  0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d

We should be able to add a network, edit a network and delete a network.

## Accounts

We should be able to generate an account from the Network, the passphrase, i.e.
salt and the class hash.

- **Network**: This cannot be changed
- **Name**: This is a Friendly name. To start, we should simply use "Account #1"
- **Address**: This cannot be changed
- **Jazzicon**: This cannot be changed
- **Private Key**: This cannot be changed for now
- **Public Key**: This cannot be changed for now

We should also be able to import an existing account. When that is the case,
the private keys as well as the address should be secured with the login. In
addition, once an account has been created, we should be able to perform a
number of operations with this account. Those operations are listed below.

### Deploy the account

By default, even if the account has everything precomputed, the account cannot
be used. The reason is it needs to be deployed first and to be deployed, it
needs to be funded with STRK. We should be able to deploy the account from the
UI.

### Manage Tokens

We should be able to view, for an account the position in ETH and STRK at least
for now. In addition, we should be able to get a QR code with the account
address to help user fund it from another wallet.

### Authorized Dapps

We should be able to add Add domain to the account that are activated. This is a
prerequisites for the account to be able to interact with the Dapps. As a
result, autorized Dapps are just protocol/domains. The user can remove those.

### Transaction history

This section should keep the history of succeeded and failed transactions
associated with the account. For details, see the "Transactions" and "Report the
Transaction" section of this document.