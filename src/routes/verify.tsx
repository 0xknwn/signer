import { useEffect } from "react";

import { useLocation } from "react-router-dom";

export const Verify = () => {
  let { state } = useLocation();

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <>
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
