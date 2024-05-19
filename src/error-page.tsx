import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <ul>
        <li>status: {isRouteErrorResponse(error) ? error.status : 0}</li>
        <li>message: {isRouteErrorResponse(error) ? error.data : "no data"}</li>
      </ul>
    </div>
  );
};
