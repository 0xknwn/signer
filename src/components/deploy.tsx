import { useState } from "react";
import { Account, RpcProvider, CallData } from "starknet";
import {
  classHash as helpersClassHash,
  classNames as helpersClassNames,
  CounterABI,
} from "@0xknwn/starknet-test-helpers";

type Props = {
  className: helpersClassNames;
};

function Deploy({ className }: Props) {
  const seed0z = {
    address: import.meta.env.VITE_OZ_ACCOUNT_ADDRESS,
    privateKey: import.meta.env.VITE_OZ_PRIVATE_KEY,
    publicKey: import.meta.env.VITE_OZ_PUBLIC_KEY,
  };

  const [transactionHash, setTransactionHash] = useState("0x0");
  const [contractAddress, setContractAddress] = useState("0x0");
  const [status, setStatus] = useState("unknown");

  const deployContract = async () => {
    setStatus("RUNNING");
    const provider = new RpcProvider({ nodeUrl: "http://localhost:5173/rpc" });
    const account = new Account(
      provider,
      seed0z.address,
      seed0z.privateKey,
      "1",
      "0x3"
    );
    let classHash = "0x0";
    switch (className) {
      case helpersClassNames.Counter:
        classHash = await helpersClassHash(className);
        break;
    }
    // @todo:
    // - check the contract class is declared
    // - check the contract is not already deployed
    const myCallData = new CallData(CounterABI);
    const _calldata = myCallData.compile("constructor", {
      owner: seed0z.address,
    });
    try {
      const { contract_address, transaction_hash } =
        await account.deployContract({
          classHash: classHash,
          constructorCalldata: _calldata,
          salt: "0x0",
        });
      setContractAddress(contract_address);
      setTransactionHash(transaction_hash);
      await account.waitForTransaction(transaction_hash);
      setStatus("SUCCEEDED");
    } catch (e) {
      setStatus("ERROR");
    }
  };

  const printStatus = () => {
    switch (status) {
      case "unknown":
        return <></>;
      case "RUNNING":
        return <p>please wait for completion...</p>;
      case "SUCCEEDED":
        return (
          <>
            <p>succeeded</p>;
            <input type="text" value={contractAddress} readOnly />
            <input type="text" value={transactionHash} readOnly />
          </>
        );
      default:
        return (
          <>
            <input type="text" value={contractAddress} readOnly />
            <input type="text" value={transactionHash} readOnly />
          </>
        );
    }
  };

  return (
    <>
      <button onClick={deployContract}>{className.toString()}</button>
      {printStatus()}
    </>
  );
}

export default Deploy;
