import { Call } from "starknet";

type NotificationOfRequestProps = {
  calls: Call[];
  application: string;
  domain: string;
  index: number;
  cleaner: () => (i: number) => void;
};

const NotificationOfRequest = ({
  calls,
  application,
  domain,
  index,
  cleaner,
}: NotificationOfRequestProps) => {
  const clean = cleaner();

  return (
    <div id={index.toString()}>
      <div>#{index.toString()}: Request</div>
      <div>application {application}</div>
      <div>domain {domain}</div>
      <div>calls: {JSON.stringify(calls)}</div>
      <button onClick={() => clean(index)}>Acknowledge</button>
    </div>
  );
};

export default NotificationOfRequest;
