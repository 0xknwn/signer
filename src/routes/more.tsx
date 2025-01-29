import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { useAccounts } from "../helpers/accounts";
import { content } from "./more.help";
import { Account, RpcProvider, Contract, cairo, type RPC07 } from "starknet";
import { ERC20ABI } from "@0xknwn/starknet-modular-account";

const seed0z = {
  address: "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691",
  privateKey: "0x71d7bb07b9a64f6f78ac4c816aff4da9",
  publicKey:
    "0x39d9e6ce352ad4530a0ef5d5a18fd3303c3606a7fa6ac5b620020ad681cc33b",
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
  // {"type":"INVOKE",
  // "transaction_hash":"0x62c30650eeeabff73357e7d5432a960132e54c570835e097640668cd7bf1def",
  // "actual_fee":{"unit":"FRI","amount":"0x13d3b5419000"},
  // "messages_sent":[],
  // "events":[{"from_address":"0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d","keys":["0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9","0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691","0xb2e3a2241a5143e804991cd1ae583abb2a4590ae0b3d37b32e79c9b8bda4fd"],"data":["0x2b5e3af16b1880000","0x0"]},
  //           {"from_address":"0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d","keys":["0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9","0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691","0x1000"],"data":["0x13d3b5419000","0x0"]}],
  // "execution_status":"SUCCEEDED",
  // "finality_status":"ACCEPTED_ON_L2",
  // "block_hash":"0x3b2711fe29eba45f2a0250c34901d15e37b495599fac1a74960a09cc83e1234",
  // "block_number":4,
  // "execution_resources":{"steps":9045,"memory_holes":176,"range_check_builtin_applications":267,"pedersen_builtin_applications":25,"poseidon_builtin_applications":4,"ec_op_builtin_applications":3,"data_availability":{"l1_gas":0,"l1_data_gas":192}}}

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
