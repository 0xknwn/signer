import { store } from "../helpers/store";

export type notif = {
  account: string;
  transaction: string;
  status: string;
};

export const addStoredNotification = (notification: notif) => {
  const storedNotification = localStorage.getItem(`${store.notifier}`);
  if (!storedNotification || storedNotification?.length === 0) {
    localStorage.setItem(`${store.notifier}`, JSON.stringify([notification]));
    return;
  }
  const notifications = JSON.parse(storedNotification) as notif[];
  notifications.push(notification);
  localStorage.setItem(`${store.notifier}`, JSON.stringify(notifications));
};

export const removeStoredNotification = (index: number) => {
  const storedNotification = localStorage.getItem(`${store.notifier}`);
  if (!storedNotification || storedNotification?.length === 0) {
    return;
  }
  const notifications = JSON.parse(storedNotification) as notif[];
  notifications.splice(index, 1);
  localStorage.setItem(`${store.notifier}`, JSON.stringify(notifications));
  return notifications;
};
