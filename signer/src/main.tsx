import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Signin from "./Signin.tsx";
import About from "./About.tsx";
import Logout from "./Logout.tsx";
import Accounts from "./Accounts.tsx";
import Transactions from "./Transactions.tsx";
import Messages from "./Messages.tsx";
import Notifier from "./Notifier.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Signin />} />
      <Route path="accounts" element={<Accounts />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="notifier" element={<Notifier />} />
      <Route path="messages" element={<Messages />} />
      <Route path="logout" element={<Logout />} />
      <Route path="about" element={<About />} />
    </Routes>
  </BrowserRouter>
);
