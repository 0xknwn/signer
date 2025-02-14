import { useState, useEffect } from "react";

export type PollerProps = {
  pathname: string;
  setRefresh: () => void;
};

const Poller = ({ pathname, setRefresh }: PollerProps) => {
  const [autoRefresh, setAutoRefresh] = useState(0);
  useEffect(() => {
    if (pathname === "/login" || pathname === "/signin" || pathname === "/") {
      return;
    }
    const interval = setInterval(() => {
      setAutoRefresh(autoRefresh + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, location, setRefresh]);

  useEffect(() => {
    if (autoRefresh % 10 !== 2) {
      return;
    }
    const fetchMessage = async () => {
      if (import.meta.env.MODE !== "development") return;
      console.log("Polling for messages");
      if (false) {
        // addStoredNotification();
        setRefresh();
        return;
      }
    };
    fetchMessage();
  }, [autoRefresh]);

  return <></>;
};

export default Poller;
