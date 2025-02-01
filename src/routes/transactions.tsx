import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { RpcProvider, shortString, Call, CallData } from "starknet";
import { content } from "./transactions.help";
// import { ChainId } from "@starknet-io/types-js";
import { useAccounts } from "../helpers/account_context";
import { useAuthn } from "../helpers/authn_context";
import { getKeys } from "../helpers/encryption";
import {
  accountAddress,
  classHash,
  SmartrAccount,
  SmartrAccountABI,
  classNames,
} from "@0xknwn/starknet-modular-account";
import { store } from "../helpers/store";
import {
  addStoredNotification,
  notificationT,
} from "../helpers/stored_notification";
import { usePolling } from "../helpers/polling_context";

function Transactions() {
  const providerURL = "http://localhost:5173/rpc";
  const provider = new RpcProvider({ nodeUrl: providerURL });
  const [help, setHelp] = useState(false);
  const [feeEstimate, setFeeEstimate] = useState(0n);
  const { selectedAccountNumber, accounts } = useAccounts();
  const { passphrase } = useAuthn();
  const [currentTransaction, setCurrentTransaction] = useState("0x0");
  const [refresh, setRefresh] = useState(0);
  const [currentTransactionStatus, setCurrentTransactionStatus] =
    useState("unknown");
  const { triggerRefresh } = usePolling();

  const [chainId, setChainId] = useState("");
  const { calls, setCalls } = usePolling();

  useEffect(() => {
    (async () => {
      const chain = (await provider.getChainId()).toString();
      setChainId(shortString.decodeShortString(chain));
    })();
  }, []);

  useEffect(() => {
    if (currentTransaction === "0x0" || refresh === 0) {
      return;
    }
    const interval = setInterval(() => {
      setRefresh(refresh + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [refresh, currentTransaction]);

  // @todo: move the refresh in a subcomponent to avoid rebuilding the whole
  // component tree every second while monitoring a transaction
  useEffect(() => {
    if (refresh % 10 === 2) {
      if (currentTransaction === "0x0") {
        return;
      }
      const transactionStatus = async () => {
        const { execution_status } = await provider.getTransactionStatus(
          currentTransaction
        );
        setCurrentTransactionStatus(execution_status?.toString() || "unknown");
        setCalls([]);
      };
      transactionStatus();
    }
  }, [refresh, currentTransaction]);

  const estimateFee = async () => {
    const provider = new RpcProvider({ nodeUrl: providerURL });
    const { publicKey, privateKey } = await getKeys(
      passphrase,
      selectedAccountNumber
    );
    const starkValidatorClassHash = classHash(classNames.StarkValidator);
    const calldata = new CallData(SmartrAccountABI).compile("constructor", {
      core_validator: starkValidatorClassHash,
      args: [publicKey],
    });
    const smartrAccountAddress = accountAddress(
      classNames.SmartrAccount,
      publicKey,
      calldata
    );
    const smartrAccount = new SmartrAccount(
      provider,
      smartrAccountAddress,
      privateKey,
      undefined,
      "1",
      "0x3"
    );
    try {
      const fee = await smartrAccount.estimateFee(calls);
      if (fee.unit === "FRI") {
        setFeeEstimate(fee.suggestedMaxFee);
      }
    } catch {
      // should return a fee of 0n if the estimate fails
      setFeeEstimate(0n);
    }
  };

  const numberOfSavedTransactions = () => {
    let count = 0;
    while (true) {
      const savedTransaction = localStorage.getItem(
        `${store.accounts}/${selectedAccountNumber}/history/${count}`
      );
      if (!savedTransaction || savedTransaction === "0x0") {
        break;
      }
      count++;
    }
    return count;
  };

  const execute = async () => {
    const provider = new RpcProvider({ nodeUrl: providerURL });
    const { publicKey, privateKey } = await getKeys(
      passphrase,
      selectedAccountNumber
    );
    const starkValidatorClassHash = classHash(classNames.StarkValidator);
    const calldata = new CallData(SmartrAccountABI).compile("constructor", {
      core_validator: starkValidatorClassHash,
      args: [publicKey],
    });
    const smartrAccountAddress = accountAddress(
      classNames.SmartrAccount,
      publicKey,
      calldata
    );
    const smartrAccount = new SmartrAccount(
      provider,
      smartrAccountAddress,
      privateKey,
      undefined,
      "1",
      "0x3"
    );
    try {
      const { transaction_hash } = await smartrAccount.execute(calls);
      setCurrentTransaction(transaction_hash);
      setCurrentTransactionStatus("RUNNING");
      const transactionNumber = numberOfSavedTransactions();
      localStorage.setItem(
        `${store.accounts}/${selectedAccountNumber}/history/${transactionNumber}`,
        transaction_hash
      );
      addStoredNotification({
        type: notificationT.EXECUTION,
        account: accounts[selectedAccountNumber].address,
        transaction: transaction_hash,
        status: "RUNNING",
      });
      triggerRefresh();
      setRefresh(1);
    } catch {
      setCurrentTransaction("0x0");
      setRefresh(0);
    }
  };

  const getChainId = async () => {
    const chain = (await provider.getChainId()).toString();
    setChainId(shortString.decodeShortString(chain));
  };

  return (
    <>
      <NavBar />
      <h1>Transactions</h1>
      <button
        onClick={() => {
          setHelp(!help);
        }}
      >
        {help ? "Hide help" : "Show help"}
      </button>
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        <>
          <button onClick={getChainId}>Get chain id</button>
          <p>Chain id: {chainId}</p>
          <textarea
            value={JSON.stringify(calls, null, 2)}
            id="transaction"
            readOnly
            cols={50}
            rows={20}
          />
          <button onClick={() => setCalls([] as Call[])}>Reset</button>
          <button onClick={estimateFee}>Estimate Fees</button>
          <p>Fee estimate: {feeEstimate}</p>
          <button onClick={execute}>Execute Transaction</button>
          <p>Current Transaction: {currentTransaction}</p>
          <p>Status: {currentTransactionStatus}</p>
        </>
      )}
    </>
  );
}

export default Transactions;
