import { useContext, createContext } from "react";

export const PollingContext = createContext<{
  triggerRefresh: () => void;
  refresh: number;
  notifications: number;
}>({
  triggerRefresh: () => {},
  refresh: 0,
  notifications: 0,
});

export const usePolling = () => {
  return useContext(PollingContext);
};
