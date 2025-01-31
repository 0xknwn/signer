import { useEffect, useState } from "react";
import Notification from "../components/notification";

import { store } from "../helpers/store";

import {
  notif,
  removeStoredNotification,
} from "../helpers/stored_notification";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([] as notif[]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const storedNotification = localStorage.getItem(`${store.notifier}`);
    if (!storedNotification || storedNotification?.length === 0) {
      return;
    }
    setNotifications(JSON.parse(storedNotification) as notif[]);
  }, [refresh]);

  const cleaner = () => (i: number) => {
    removeStoredNotification(i);
    setRefresh(refresh + 1);
  };

  return (
    <>
      <button onClick={() => setRefresh(refresh + 1)}>Refresh</button>
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          index={index}
          account={notification.account}
          transaction={notification.transaction}
          status={notification.status}
          cleaner={cleaner}
        />
      ))}
    </>
  );
};

export default NotificationList;
