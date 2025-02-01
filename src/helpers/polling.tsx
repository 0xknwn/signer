import { useState, useEffect } from "react";
import { PollingContext } from "./polling_context";
import { useLocation } from "react-router";
import { store } from "./store";
import Poller from "./poller";

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
  const [manualRefresh, setManualRefresh] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const value = {
    triggerRefresh: () => {
      setManualRefresh(manualRefresh + 1);
    },
    refresh: manualRefresh,
    notifications,
  };

  useEffect(() => {
    setNotifications(pollNotifications());
  }, [manualRefresh]);

  return (
    <>
      <Poller
        pathname={location.pathname}
        setRefresh={() => {
          setManualRefresh(manualRefresh + 1);
        }}
      />
      <PollingContext.Provider value={value}>
        {children}
      </PollingContext.Provider>
    </>
  );
};
