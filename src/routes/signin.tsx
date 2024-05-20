import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  let navigate = useNavigate();

  const clickHandler = () => {
    navigate("/verify", { state: { key: "value" } });
  };
  return (
    <>
      <Link to="/">back</Link>, no account? <Link to="/signup">signup</Link>
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
        <input type="button" onClick={clickHandler} value="submit" />
      </form>
    </>
  );
};
