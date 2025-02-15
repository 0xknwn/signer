import { useEffect, useState } from "react";
import { useAuthn } from "./authn_context";
import Refresher from "./refresher";

const Refreshers = () => {
  const [timing, setTiming] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const { channels } = useAuthn();

  useEffect(() => {
    const interval = setInterval(() => {
      setTiming(timing + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timing]);

  useEffect(() => {
    if (timing % 10 === 2) {
      setRefresh(refresh + 1);
    }
  }, [timing]);

  return (
    <div>
      {Object.entries(channels)?.map((k) => (
        <Refresher key={k[0]} channelID={k[0]} refresh={refresh} />
      ))}
    </div>
  );
};

export default Refreshers;
