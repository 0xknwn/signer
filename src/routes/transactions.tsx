import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { RpcProvider, shortString, Call, CallData } from "starknet";
import { content } from "./transactions.help";
// import { ChainId } from "@starknet-io/types-js";
import { useAccounts } from "../helpers/account_context";
import { useAuth } from "../helpers/authn_context";
import { getKeys } from "../helpers/encryption";
import {
  accountAddress,
  classHash,
  SmartrAccount,
  SmartrAccountABI,
  classNames,
} from "@0xknwn/starknet-modular-account";
import { store } from "../helpers/store";
import { addStoredNotification } from "../helpers/stored_notification";

function Transactions() {
  const providerURL = "http://localhost:5173/rpc";
  const provider = new RpcProvider({ nodeUrl: providerURL });
  const [help, setHelp] = useState(false);
  const [feeEstimate, setFeeEstimate] = useState(0n);
  const { selectedAccountNumber, accounts } = useAccounts();
  const { passphrase } = useAuth();
  const [currentTransaction, setCurrentTransaction] = useState("0x0");
  const [refresh, setRefresh] = useState(0);
  const [currentTransactionStatus, setCurrentTransactionStatus] =
    useState("unknown");

  const [chainId, setChainId] = useState("");
  const [calls, setCalls] = useState("[]");

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
      };
      transactionStatus();
    }
  }, [refresh, currentTransaction]);

  const sanitize = async () => {
    const sanitizedCalls = [] as Call[];
    const parsedCalls = JSON.parse(calls);
    if (Array.isArray(parsedCalls)) {
      for (const call of parsedCalls) {
        if (
          Object.prototype.hasOwnProperty.call(call, "entrypoint") &&
          Object.prototype.hasOwnProperty.call(call, "contractAddress") &&
          Object.prototype.hasOwnProperty.call(call, "calldata") &&
          Array.isArray(call.calldata)
        ) {
          const sanitizedCall = {
            entrypoint: call.entrypoint,
            contractAddress: call.contractAddress,
            calldata: call.calldata,
          } as Call;
          sanitizedCalls.push(sanitizedCall);
        } else {
          return [] as Call[];
        }
      }
    }
    return sanitizedCalls;
  };

  const estimateFee = async () => {
    const sanitizedCalls = await sanitize();
    if (sanitizedCalls.length === 0) {
      return;
    }
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
      const fee = await smartrAccount.estimateFee(sanitizedCalls);
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
    const sanitizedCalls = await sanitize();
    if (sanitizedCalls.length === 0) {
      return;
    }
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
      const { transaction_hash } = await smartrAccount.execute(sanitizedCalls);
      setCurrentTransaction(transaction_hash);
      setCurrentTransactionStatus("RUNNING");
      const transactionNumber = numberOfSavedTransactions();
      localStorage.setItem(
        `${store.accounts}/${selectedAccountNumber}/history/${transactionNumber}`,
        transaction_hash
      );
      addStoredNotification({
        account: accounts[selectedAccountNumber].address,
        transaction: transaction_hash,
        status: "RUNNING",
      });
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
            value={calls}
            onChange={(e) => {
              setCalls(e.target.value);
            }}
            id="transaction"
          />
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
