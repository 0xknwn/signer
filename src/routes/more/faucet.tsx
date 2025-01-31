import { useEffect, useState } from "react";
import { useAccounts } from "../../helpers/account_context";
import { Account, RpcProvider, Contract, cairo } from "starknet";
import { ERC20ABI } from "@0xknwn/starknet-modular-account";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

function Faucet() {
  const { refreshTokens } = useAccounts();
  const seed0z = {
    address: import.meta.env.VITE_OZ_ACCOUNT_ADDRESS,
    privateKey: import.meta.env.VITE_OZ_PRIVATE_KEY,
    publicKey: import.meta.env.VITE_OZ_PUBLIC_KEY,
  };

  const [transactionHash, setTransactionHash] = useState("0x0");
  const [refresh, setRefresh] = useState(0);
  const [status, setStatus] = useState("unknown");

  const getTransactionStatus = async () => {
    const provider = new RpcProvider({ nodeUrl: "http://localhost:5173/rpc" });
    const { execution_status } = await provider.getTransactionStatus(
      transactionHash
    );
    setStatus(execution_status?.toString() || "unknown");
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
      refreshTokens();
    }
  }, [status]);

  const { accounts, selectedAccountNumber } = useAccounts();
  useEffect(() => {
    if (accounts.length === 0) {
      return;
    }
    setDestAddress(accounts[selectedAccountNumber].address);
  }, [accounts, selectedAccountNumber]);
  const [destAddress, setDestAddress] = useState("0x0");

  const sendStrk = async () => {
    setStatus("RUNNING");
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
    const initial_StrkTransfer = cairo.uint256(5000n * 10n ** 15n);
    const call = STRK.populate("transfer", {
      recipient: destAddress,
      amount: initial_StrkTransfer,
    });
    const { transaction_hash } = await a.execute(call);
    setTransactionHash(transaction_hash);
    setRefresh(1);
  };

  const printStatus = () => {
    switch (status) {
      case "unknown":
        return <></>;
      case "RUNNING":
        return <p>please wait for completion...</p>;
      case "SUCCEEDED":
        return <p>succeeded</p>;
      default:
        return (
          <>
            <input type="text" value={transactionHash} readOnly />
            <input type="text" value={status} readOnly />
            <input type="text" value={refresh} readOnly />
          </>
        );
    }
  };

  return (
    <>
      <h2>STRK Faucet</h2>
      <input
        type="text"
        id="address"
        value={destAddress}
        onChange={(e) => {
          setDestAddress(e.target.value);
        }}
      />
      <Jazzicon diameter={32} seed={jsNumberForAddress(destAddress)} />
      <button onClick={sendStrk}>Request</button>
      {printStatus()}
    </>
  );
}

export default Faucet;
