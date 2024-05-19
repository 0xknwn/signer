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

        <button type="submit">Login</button>
      </form>
    </>
  );
};
