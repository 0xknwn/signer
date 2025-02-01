import { useContext, createContext } from "react";
import { Call } from "starknet";

export const PollingContext = createContext<{
  triggerRefresh: () => void;
  refresh: number;
  notifications: number;
  calls: Call[];
  setCalls: (calls: Call[]) => void;
}>({
  triggerRefresh: () => {},
  refresh: 0,
  notifications: 0,
  calls: [] as Call[],
  setCalls: () => {},
});

export const usePolling = () => {
  return useContext(PollingContext);
};
