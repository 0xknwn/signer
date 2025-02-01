import { useNavigate } from "react-router";
import { usePolling } from "../helpers/polling_context";

type NotificationOfRequestProps = {
  calls: string;
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
  const navigate = useNavigate();
  const { setCalls } = usePolling();
  const clean = cleaner();

  return (
    <div id={index.toString()}>
      <div>#{index.toString()}: Request</div>
      <div>application {application}</div>
      <div>domain {domain}</div>
      <textarea value={calls} id="calls" readOnly cols={50} rows={20} />
      <button onClick={() => clean(index)}>Acknowledge</button>
      <button
        onClick={() => {
          setCalls(JSON.parse(calls));
          clean(index);
          navigate("/transactions");
        }}
      >
        Go to Transactions
      </button>
    </div>
  );
};

export default NotificationOfRequest;
