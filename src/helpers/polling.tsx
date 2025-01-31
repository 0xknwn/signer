import { useState, useEffect } from "react";
import { PollingContext } from "./polling_context";

type PollingProviderProps = {
  children: React.ReactNode;
};

export const PollingProvider = ({ children }: PollingProviderProps) => {
  const [refresh, setRefresh] = useState(0);
  const value = {
    refresh,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(refresh + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <PollingContext.Provider value={value}>{children}</PollingContext.Provider>
  );
};
