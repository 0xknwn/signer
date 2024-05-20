import { useEffect } from "react";

import { useLocation, Link } from "react-router-dom";

export const Verify = () => {
  let { state } = useLocation();

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <>
      <Link to="/">back</Link>
      <h1>Verify: /verify</h1>
      <form>
        <label>
          Verification Code :
          <input type="text" />
        </label>

        <button type="submit">Login</button>
      </form>
    </>
  );
};