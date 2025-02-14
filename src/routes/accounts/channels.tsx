import { NavLink, Outlet } from "react-router";

function Channels() {
  return (
    <>
      <>
        <nav>
          <NavLink className="tab" to="list">
            List
          </NavLink>
          <NavLink className="tab" to="new">
            New
          </NavLink>
        </nav>
        <Outlet />
      </>
    </>
  );
}

export default Channels;
