import { useState, useEffect } from "react";
import { PollingContext } from "./polling_context";
import { useLocation } from "react-router";
import { store } from "./store";

const fetchMessage = async () => {
  if (import.meta.env.MODE !== "development") return;
  const response = await fetch("/message");
  const data = await response.json();
  if (data?.calls) console.log(JSON.parse(data.calls));
  return;
};

const pollNotifications = () => {
  const data = localStorage.getItem(store.notifier);
  if (!data) return 0;
  const notifications = JSON.parse(data);
  return notifications?.length || 0;
};

type PollingProviderProps = {
  children: React.ReactNode;
};

export const PollingProvider = ({ children }: PollingProviderProps) => {
  const location = useLocation();
  const [autoRefresh, setAutoRefresh] = useState(0);
  const [manualRefresh, setManualRefresh] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const value = {
    triggerRefresh: () => setManualRefresh(manualRefresh + 1),
    notifications,
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
      setAutoRefresh(autoRefresh + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, location]);

  useEffect(() => {
    if (autoRefresh % 10 === 2) {
      fetchMessage();
      setNotifications(pollNotifications());
    }
  }, [autoRefresh]);

  useEffect(() => {
    fetchMessage();
    setNotifications(pollNotifications());
  }, [manualRefresh]);

  return (
    <PollingContext.Provider value={value}>{children}</PollingContext.Provider>
  );
};
