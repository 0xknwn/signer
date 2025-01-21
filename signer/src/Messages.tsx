import NavBar from "./Navbar";

function Messages() {
  return (
    <>
      <NavBar />
      <h1>**Later** Message Signatures</h1>
      <p>
        The signer should be able to sign EIP-712 like messages. This is key for
        scenarios that rely on offchain authorizations. However, this should not
        be implemented as part of the first iteration of the product.
      </p>
    </>
  );
}

export default Messages;
