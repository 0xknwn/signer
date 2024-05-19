import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./routes/root.tsx";
import { ErrorPage } from "./error-page.tsx";
import { Signin } from "./routes/signin.tsx";
import { Signup } from "./routes/signup.tsx";
import "./style.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "signin",
    element: <Signin />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
