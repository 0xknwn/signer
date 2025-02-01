import { Call } from "starknet";
import { store } from "../helpers/store";

export enum notificationT {
  EXECUTION = "execution",
  CHANNEL = "channel",
  REQUEST = "request",
}

export type notification =
  | {
      type: notificationT.EXECUTION;
      account: string;
      transaction: string;
      status: string;
    }
  | {
      type: notificationT.REQUEST;
      calls: Call[];
      application: string;
      domain: string;
    };

export const addStoredNotification = (notification: notification) => {
  const storedNotification = localStorage.getItem(`${store.notifier}`);
  if (!storedNotification || storedNotification?.length === 0) {
    localStorage.setItem(`${store.notifier}`, JSON.stringify([notification]));
    return;
  }
  const notifications = JSON.parse(storedNotification) as notification[];
  notifications.push(notification);
  localStorage.setItem(`${store.notifier}`, JSON.stringify(notifications));
};

export const removeStoredNotification = (index: number) => {
  const storedNotification = localStorage.getItem(`${store.notifier}`);
  if (!storedNotification || storedNotification?.length === 0) {
    return;
  }
  const notifications = JSON.parse(storedNotification) as notification[];
  notifications.splice(index, 1);
  localStorage.setItem(`${store.notifier}`, JSON.stringify(notifications));
  return notifications;
};
