export const Signup = () => {
  
  return (
    <>
      <h1>Signup: /signup</h1>
      <form>
        <label>
          Email:
          <input type="email" />
        </label>

        <label>
          Password:
          <input type="password" />
        </label>

        <label>
          Confirm Password:
          <input type="password" />
        </label>

        <label>
          Friendly Name:
          <input type="text" />
        </label>

        <label>
          Color:
          <select name="color">
            <option value="">--Please choose a color--</option>
            <option value="red">Red</option>
            <option value="white">White</option>
            <option value="blue">Blue</option>
          </select>
        </label>

        <button type="submit">Submit</button>
      </form>
    </>
  );
};
