export const Root = () => {
  return (
    <>
      <h1>Route: /</h1>
      <nav>
        <ul>
          <li>
            <a href={`/login`}>login</a>
          </li>
          <li>
            <a href={`/register`}>register</a>
          </li>
        </ul>
      </nav>
    </>
  );
};
