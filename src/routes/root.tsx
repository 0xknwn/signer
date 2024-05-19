import { Link } from "react-router-dom";

export const Root = () => {
  return (
    <>
      <Link to="/">back</Link>
      <h1>Route: /</h1>
      <nav>
        <ul>
          <li>
            <Link to="/signin">signin</Link>
          </li>
          <li>
            <Link to="/signup">signup</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
