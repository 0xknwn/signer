import { useContext, createContext } from "react";

export const PollingContext = createContext<{
  refresh: number;
}>({
  refresh: 0,
});

export const usePolling = () => {
  return useContext(PollingContext);
};
