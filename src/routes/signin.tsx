import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  return (
    <>
      <h1>Signin: /signin</h1>
      <form>
        <label>
          Email:
          <input type="email" />
        </label>

        <label>
          Password:
          <input type="password" />
        </label>

        <Link to="/verify" state={{ key: "value" }}>
          submit
        </Link>
      </form>
    </>
  );
};
