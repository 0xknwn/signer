import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { useAccounts } from "../helpers/accounts";
import { content } from "./more.help";
import { Account, RpcProvider, Contract, cairo } from "starknet";
import { ERC20ABI } from "@0xknwn/starknet-modular-account";

const seed0z = {
  address: import.meta.env.OZ_ACCOUNT_ADDRESS,
  privateKey: import.meta.env.OZ_PRIVATE_KEY,
  publicKey: import.meta.env.OZ_PUBLIC_KEY,
};

function More() {
  const [transactionHash, setTransactionHash] = useState("0x0");
  const [refresh, setRefresh] = useState(0);
  const [status, setStatus] = useState("unknown");
  const [receipt, setReceipt] = useState({
    block_hash: "0x0",
    actual_fee: { unit: "FRI", amount: "0x0" },
  });

  const getTransactionStatus = async () => {
    const provider = new RpcProvider({ nodeUrl: "http://localhost:5173/rpc" });
    const { execution_status } = await provider.getTransactionStatus(
      transactionHash
    );
    setStatus(execution_status?.toString() || "unknown");
  };

  const getTransactionReceipt = async () => {
    const provider = new RpcProvider({ nodeUrl: "http://localhost:5173/rpc" });
    const { block_hash, actual_fee } = (await provider.getTransactionReceipt(
      transactionHash
    )) as {
      block_hash: string;
      actual_fee: { unit: string; amount: string };
    };
    setReceipt({ block_hash, actual_fee });
  };

  useEffect(() => {
    if (transactionHash === "0x0" || refresh === 0) {
      return;
    }
    const interval = setInterval(() => {
      setRefresh(refresh + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [refresh, transactionHash]);

  useEffect(() => {
    if (refresh % 15 === 2) {
      if (transactionHash === "0x0") {
        return;
      }
      getTransactionStatus();
    }
  }, [refresh]);

  useEffect(() => {
    if (status === "SUCCEEDED") {
      setRefresh(0);
      getTransactionReceipt();
    }
  }, [status]);

  const { accounts, selectedAccountNumber } = useAccounts();
  useEffect(() => {
    if (accounts.length === 0) {
      return;
    }
    setDestAddress(accounts[selectedAccountNumber].address);
  }, [accounts, selectedAccountNumber]);
  const [destAddress, setDestAddress] = useState("");
  const [help, setHelp] = useState(false);

  const sendStrk = async () => {
    const provider = new RpcProvider({ nodeUrl: "http://localhost:5173/rpc" });
    const a = new Account(
      provider,
      seed0z.address,
      seed0z.privateKey,
      "1",
      "0x3"
    );
    const STRK = new Contract(
      ERC20ABI,
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      a
    );
    const initial_StrkTransfer = cairo.uint256(50000n * 10n ** 15n);
    const call = STRK.populate("transfer", {
      recipient: destAddress,
      amount: initial_StrkTransfer,
    });
    const { transaction_hash } = await a.execute(call);
    setTransactionHash(transaction_hash);
    setRefresh(1);
  };

  return (
    <>
      <NavBar />
      <h1>More</h1>
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
          <h2>Send STRK</h2>
          <input type="text" id="from" value={seed0z.address} readOnly />
          <input type="text" id="address" value={destAddress} readOnly />
          <input type="text" id="amount" value={50000} readOnly />
          <button onClick={sendStrk}>Send</button>
          <h2>Transaction</h2>
          <input type="text" value={transactionHash} readOnly />
          <input type="text" value={status} readOnly />
          <input type="text" value={refresh} readOnly />
          <div>
            {receipt?.block_hash !== "0x0" && (
              <>
                <p>block: {receipt.block_hash}</p>
                <p>
                  Fees: {receipt.actual_fee.amount} {receipt.actual_fee.unit}{" "}
                </p>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default More;
