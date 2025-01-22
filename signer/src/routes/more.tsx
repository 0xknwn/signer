import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useState } from "react";

const content = `
This pages provides some of the hints that the application may involve in the
future. The following features are not part of the initial implementation.

## \`**\`Later\`**\` Additional features

The project can provide additional features in the future. This section of the
documentation provides


- **Indexer and Tokens** The signer should be able to list other tokens or data
  that are available on the network (e.g. ERC20, ERC721, transaction history).
  The token list should be available for the account that is selected. In order
  to provide this feature
- **Signin Messages** This feature is necessary to work offline and limit the
  cost or hide some operations. The signer should be able to sign EIP-712 like
  messages. This should not be implemented as part of the first iteration of the
  product.
- **Smartr Connect** A library that integrate getstarknet/starknetkit and
  provides a way to exchange data with the signer.
- **Smartr Agent** An API that can handle advanced services for the account,
  including the ability to execute transactions on events while disconnected.
- **Smartr Guard** A service that allows the user to recover a lost wallet in
  case the user has lost the passphrase.
`;

function More() {
  const [help, setHelp] = useState(false);

  const activateLasers = () => {
    setHelp(!help);
  };

  return (
    <>
      <NavBar />
      <h1>More</h1>
      <button onClick={activateLasers}>
        {help ? "Hide help" : "Show help"}
      </button>
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        "Oops! This page is under construction."
      )}
    </>
  );
}

export default More;
