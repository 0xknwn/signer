import { useState, useEffect } from "react";
import { PollingContext } from "./polling_context";
import { useLocation } from "react-router";

type PollingProviderProps = {
  children: React.ReactNode;
};

const fetchMessage = async () => {
  if (import.meta.env.MODE !== "development") return;
  const response = await fetch("/message");
  const data = await response.json();
  if (data?.calls) console.log(JSON.parse(data.calls));
  return;
};

export const PollingProvider = ({ children }: PollingProviderProps) => {
  const location = useLocation();
  const [refresh, setRefresh] = useState(0);
  const value = {
    refresh,
  };

  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/signin" ||
      location.pathname === "/"
    ) {
      return;
    }
    const interval = setInterval(() => {
      setRefresh(refresh + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [refresh, location]);

  useEffect(() => {
    if (refresh % 10 === 2) {
      fetchMessage();
    }
  }, [refresh]);

  return (
    <PollingContext.Provider value={value}>{children}</PollingContext.Provider>
  );
};
