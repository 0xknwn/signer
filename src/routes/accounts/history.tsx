import { useAccounts } from "../../helpers/account_context";
import { useEffect, useState } from "react";
import { RpcProvider } from "starknet";

import { store } from "../../helpers/store";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([] as string[]);
  const { selectedAccountNumber } = useAccounts();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const savedTransactions = [] as string[];
    let count = 0;
    while (true) {
      const savedTransaction = localStorage.getItem(
        `${store.accounts}/${selectedAccountNumber}/history/${count}`
      );
      if (!savedTransaction || savedTransaction === "0x0") {
        break;
      }
      savedTransactions.push(savedTransaction);
      count++;
    }
    setTransactions(savedTransactions);
  }, [refresh]);

  return (
    <>
      <button onClick={() => setRefresh(refresh + 1)}>Refresh</button>
      {transactions.map((transaction, index) => (
        <>
          <p>
            transaction #{index}: {transaction}
          </p>
          <Transaction
            key={index}
            transaction={transaction}
            refresh={refresh}
          />
        </>
      ))}
    </>
  );
};

type TransactionProps = {
  transaction: string;
  refresh: number;
};

const Transaction = ({ transaction, refresh }: TransactionProps) => {
  const [status, setStatus] = useState("retrieving");

  useEffect(() => {
    const fetchStatus = async () => {
      setStatus("REFRESHING");
      const provider = new RpcProvider({
        nodeUrl: "http://localhost:5173/rpc",
      });
      const { execution_status } = await provider.getTransactionStatus(
        transaction
      );
      setStatus(execution_status?.toString() || "unknown");
    };
    fetchStatus();
  }, [refresh]);

  return (
    <>
      <p>{status}</p>
    </>
  );
};

const History = () => {
  const { accounts, selectedAccountNumber } = useAccounts();
  return (
    <>
      {accounts && accounts.length > 0 && (
        <div>
          <p>Address: {accounts[selectedAccountNumber].address}</p>
          <p>Public key: {accounts[selectedAccountNumber].publickey}</p>
        </div>
      )}
      <TransactionList />
      <p>Here you can see the account transaction history</p>
    </>
  );
};

export default History;
