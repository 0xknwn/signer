import { useEffect, useState } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";

export const Verify = () => {
  let { state } = useLocation();
  const [status, setStatus] = useState(0);

  const handleClick = async () => {
    const res = await fetch("/api/verify", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: "a@b.c",
        verification_key: "123",
      }),
    });
    if (res.status === 200) {
      console.log("Success");
      setStatus(200);
    } else if (res.status === 401) {
      console.log("Unauthorized");
      setStatus(401);
    } else {
      console.log("Bad Request");
      setStatus(400);
    }
  };

  useEffect(() => {
    if (status === 200 || status === 0) {
      return;
    }
    console.log("Verify has somehow failed.");
  }, [status]);

  return (
    <>
      {status === 200 ? (
        <Navigate replace to={"/accounts"} />
      ) : state && state.key ? (
        <>
          <Link to="/">back</Link>
          <h1>Verify: /verify</h1>
          <form>
            <label>
              Verification Code :
              <input type="text" />
            </label>
            <input
              type="button"
              onClick={handleClick}
              name="verify"
              value="verify"
            />
            <div hidden>{status}</div>
          </form>
        </>
      ) : (
        <Navigate replace to={"/signin"} />
      )}
    </>
  );
};
