import NavBar from "../components/navbar";

function Notifier() {
  return (
    <>
      <NavBar />
      <h1>Notifier</h1>
      <p>
        The application should provide a notifier section where you can find
        informations about the fact that a transaction has succeeded or failed.
        Those informations can be acknowledged like in a mailbox.
      </p>
    </>
  );
}

export default Notifier;
