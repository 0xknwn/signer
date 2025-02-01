import { useEffect, useState } from "react";
import NotificationOfExecution from "./notification_execution";

import { store } from "../helpers/store";
import { usePolling } from "../helpers/polling_context";
import {
  notification,
  notificationT,
  removeStoredNotification,
} from "../helpers/stored_notification";
import NotificationOfRequest from "./notification_request";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([] as notification[]);
  const [manualRefresh, setManualRefresh] = useState(0);
  const { triggerRefresh, refresh } = usePolling();

  useEffect(() => {
    const storedNotification = localStorage.getItem(`${store.notifier}`);
    if (!storedNotification || storedNotification?.length === 0) {
      return;
    }
    setNotifications(JSON.parse(storedNotification) as notification[]);
  }, [refresh, manualRefresh]);

  const cleaner = () => (i: number) => {
    removeStoredNotification(i);
    triggerRefresh();
    setManualRefresh(manualRefresh + 1);
  };


  return (
    <>
      
      <button onClick={() => setManualRefresh(manualRefresh + 1)}>
        Refresh
      </button>
      {notifications.map((notification, index) => {
          if (notification.type === notificationT.EXECUTION) {
          return (
            <NotificationOfExecution
              key={index}
              index={index}
              account={notification.account}
              transaction={notification.transaction}
              status={notification.status}
              cleaner={cleaner}
            />
          );
        } else if (notification.type === notificationT.REQUEST) {
          return (
            <NotificationOfRequest
              key={index}
              index={index}
              calls={notification.calls}
              application={notification.application}
              domain={notification.domain}
              cleaner={cleaner}
            />
          );
        } else {
          return <div key={index}>Unknown</div>;
        }
      })}
    </>
  );
};

export default NotificationList;
