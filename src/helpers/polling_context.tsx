import { useContext, createContext } from "react";

export const PollingContext = createContext<{
  triggerRefresh: () => void;
  notifications: number;
}>({
  triggerRefresh: () => {},
  notifications: 0,
});

export const usePolling = () => {
  return useContext(PollingContext);
};
