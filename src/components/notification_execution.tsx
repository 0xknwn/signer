import { useEffect, useState } from "react";
import { RpcProvider } from "starknet";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

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

type NotificationOfExecutionProps = {
  transaction: string;
  account: string;
  status: string;
  index: number;
  cleaner: () => (i: number) => void;
};

const NotificationOfExecution = ({
  transaction,
  account,
  status,
  index,
  cleaner,
}: NotificationOfExecutionProps) => {
  const clean = cleaner();
  const [monitoredStatus, setMonitoredStatus] = useState(status);
  useEffect(() => {
    if (monitoredStatus !== "RUNNING") {
      return;
    }
    const fetchStatus = async () => {
      const provider = new RpcProvider({
        nodeUrl: "window.location.origin + "/api/sepolia"",
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
      <div>#{index.toString()}: Transaction</div>
      <div>
        <Account address={account} />
      </div>
      <div>transaction {transaction}</div>
      <div>status: {monitoredStatus}</div>
      <button onClick={() => clean(index)}>Acknowledge</button>
    </div>
  );
};

export default NotificationOfExecution;
