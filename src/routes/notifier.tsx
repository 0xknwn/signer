import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";

import { content } from "./notifier.help";

import { useEffect, useState } from "react";
import { RpcProvider } from "starknet";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { store } from "../helpers/store";

export type notif = {
  account: string;
  transaction: string;
  status: string;
};

type AccountProps = {
  address: string;
};

const Account = ({ address }: AccountProps) => {
  return (
    <div>
      <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />{" "}
      {address.substring(0, 6) +
        "..." +
        address.substring(address.length - 4, address.length)}
    </div>
  );
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

const removeStoredNotification = (index: number) => {
  const storedNotification = localStorage.getItem(`${store.notifier}`);
  if (!storedNotification || storedNotification?.length === 0) {
    return;
  }
  const notifications = JSON.parse(storedNotification) as notif[];
  notifications.splice(index, 1);
  localStorage.setItem(`${store.notifier}`, JSON.stringify(notifications));
  return notifications;
};

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

type NotificationProps = {
  transaction: string;
  account: string;
  status: string;
  index: number;
  cleaner: () => (i: number) => void;
};

const Notification = ({
  transaction,
  account,
  status,
  index,
  cleaner,
}: NotificationProps) => {
  const clean = cleaner();
  const [monitoredStatus, setMonitoredStatus] = useState(status);
  useEffect(() => {
    if (monitoredStatus !== "RUNNING") {
      return;
    }
    const fetchStatus = async () => {
      const provider = new RpcProvider({
        nodeUrl: "http://localhost:5173/rpc",
      });
      const { execution_status } = await provider.getTransactionStatus(
        transaction
      );
      setMonitoredStatus(execution_status?.toString() || "UNKNOWN");
    };
    fetchStatus();
  }, []);

  return (
    <div id={index.toString()}>
      <div>
        <Account address={account} />
      </div>
      <div>transaction {transaction}</div>
      <div>status: {monitoredStatus}</div>
      <button onClick={() => clean(index)}>Acknowledge</button>
    </div>
  );
};

function Notifier() {
  const [help, setHelp] = useState(false);
  return (
    <>
      <NavBar />
      <h1>Notifier</h1>
      <button
        onClick={() => {
          setHelp(!help);
        }}
      >
        {help ? "Hide help" : "Show help"}
      </button>
      {help ? <Markdown>{content}</Markdown> : <NotificationList />}
    </>
  );
}

export default Notifier;
