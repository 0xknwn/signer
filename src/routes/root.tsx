export const Root = () => {
  return (
    <>
      <h1>Route: /</h1>
      <nav>
        <ul>
          <li>
            <a href={`/signin`}>signin</a>
          </li>
          <li>
            <a href={`/signup`}>signup</a>
          </li>
        </ul>
      </nav>
    </>
  );
};
