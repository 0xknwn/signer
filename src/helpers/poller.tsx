import { useState, useEffect } from "react";
import { addStoredNotification, notificationT } from "./stored_notification";
import { Call } from "starknet";

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
      const response = await fetch("/message");
      const data = await response.json();
      if (
        data?.type !== notificationT.REQUEST.toString() ||
        !data?.calls ||
        !data?.domain ||
        !data?.application
      ) {
        return;
      }
      if (!Array.isArray(data.calls)) {
        return;
      }
      for (const call of data.calls) {
        if (
          !call?.contractAddress ||
          !call?.entrypoint ||
          !call?.calldata ||
          !Array.isArray(call.calldata)
        ) {
          return;
        }
      }
      const notif = {
        type: notificationT.REQUEST as notificationT.REQUEST,
        calls: data.calls as Call[],
        domain: data.domain as string,
        application: data.application as string,
      };
      addStoredNotification(notif);
      setRefresh();
      return;
    };
    fetchMessage();
  }, [autoRefresh]);

  return <></>;
};

export default Poller;
