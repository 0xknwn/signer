import { useEffect, useState } from "react";
import { Account, RpcProvider, CallData, hash, ec } from "starknet";
import {
  classHash as helpersClassHash,
  classNames as helpersClassNames,
  CounterABI,
} from "@0xknwn/starknet-test-helpers";

type Props = {
  className: helpersClassNames;
};

const udcAddress = BigInt(
  "0x41a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf"
);

const computeContractAddress = async (
  contractName: helpersClassNames,
  deployerAddress: string,
  constructorCallData: string[]
): Promise<string> => {
  const class_hash = helpersClassHash(contractName);
  return hash.calculateContractAddressFromHash(
    ec.starkCurve.pedersen(deployerAddress, 0),
    class_hash,
    constructorCallData,
    udcAddress
  );
};

const seed0z = {
  address: import.meta.env.VITE_OZ_ACCOUNT_ADDRESS,
  privateKey: import.meta.env.VITE_OZ_PRIVATE_KEY,
  publicKey: import.meta.env.VITE_OZ_PUBLIC_KEY,
};

function Deploy({ className }: Props) {
  const [classHash, setClassHash] = useState("0x0");
  const [contractAddress, setContractAddress] = useState("0x0");
  const [transactionHash, setTransactionHash] = useState("0x0");
  const [isDeclared, setIsDeclared] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [status, setStatus] = useState("unknown");

  useEffect(() => {
    const fetchClassHash = async () => {
      const classHash = helpersClassHash(className);
      setClassHash(classHash);
    };
    fetchClassHash();
  }, [classHash, className]);

  useEffect(() => {
    const myCallData = new CallData(CounterABI);
    const _calldata = myCallData.compile("constructor", {
      owner: seed0z.address,
    });
    const fetchContractAddress = async () => {
      const address = await computeContractAddress(
        className,
        seed0z.address,
        _calldata
      );
      setContractAddress(address);
    };
    fetchContractAddress();
  }, [classHash, className]);

  useEffect(() => {
    const fetchDeclaredStatus = async () => {
      if (classHash === "0x0") return;
      const provider = new RpcProvider({
        nodeUrl: "window.location.origin + "/api/sepolia"",
      });
      await provider.getClassByHash(classHash);
      setIsDeclared(true);
    };
    fetchDeclaredStatus();
  }, [classHash]);

  useEffect(() => {
    const fetchDeploymentStatus = async () => {
      if (contractAddress === "0x0") return;
      const provider = new RpcProvider({
        nodeUrl: "window.location.origin + "/api/sepolia"",
      });
      const hash = await provider.getClassHashAt(contractAddress);
      if (hash === classHash) {
        setIsDeployed(true);
      } else {
        console.log("Contract not deployed");
        setIsDeployed(false);
      }
    };
    fetchDeploymentStatus();
  }, [contractAddress, classHash]);

  const deployContract = async () => {
    setStatus("RUNNING");
    const provider = new RpcProvider({ nodeUrl: "window.location.origin + "/api/sepolia"" });
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
    setClassHash(classHash);
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
    } catch {
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
      <h3>{className}</h3>
      {isDeclared ? (
        <>
          <input type="text" value={classHash} readOnly />
          <input type="text" value={contractAddress} readOnly />
          <button
            onClick={() => {
              navigator.clipboard.writeText(contractAddress);
            }}
          >
            Copy Address
          </button>
          {isDeployed ? (
            "Contract is deployed"
          ) : (
            <button onClick={deployContract}>Deploy</button>
          )}

          {printStatus()}
        </>
      ) : (
        "Class is not declared"
      )}
    </>
  );
}

export default Deploy;
