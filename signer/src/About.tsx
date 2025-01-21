import NavBar from "./Navbar";

function About() {
  return (
    <>
      <NavBar />
      <h1>About</h1>
      <p>
        This pages provides some of the hints that the application may involve
        in the future. The following features are not part of the initial
        implementation.
      </p>
      <h2>**Later** Additional features</h2>
      <p>
        The project can provide additional features in the future. This section
        of the documentation provides
      </p>
      <ul>
        <li>
          <b>Indexer and Tokens</b> The signer should be able to list other
          tokens or data that are available on the network (e.g. ERC20, ERC721,
          transaction history). The token list should be available for the
          account that is selected. In order to provide this feature
        </li>
        <li>
          <b>Smartr Connect</b> A library that integrate getstarknet/starknetkit
          and provides a way to exchange data with the signer.
        </li>
        <li>
          <b>Smartr Agent</b> An API that can handle advanced services for the
          account, including the ability to execute transactions on events while
          disconnected.
        </li>
        <li>
          <b>Smartr Guard</b> A service that allows the user to recover a lost
          wallet in case the user has lost the passphrase.
        </li>
      </ul>
    </>
  );
}

export default About;
