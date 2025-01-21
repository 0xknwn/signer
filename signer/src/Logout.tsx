import NavBar from "./Navbar";

function Logout() {
  return (
    <>
      <NavBar />
      <h1>Logout</h1>
      The logout button should disconnect the user and redirect to the signin
      page.
    </>
  );
}

export default Logout;
