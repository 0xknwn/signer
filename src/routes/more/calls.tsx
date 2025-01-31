import { useEffect, useState } from "react";
import { RpcProvider, CallData, hash, ec, Contract } from "starknet";
import {
  classHash as helpersClassHash,
  classNames as helpersClassNames,
  CounterABI,
} from "@0xknwn/starknet-test-helpers";

type Props = {
  name: helpersClassNames;
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

function Calls({ name: className }: Props) {
  const seed0z = {
    address: import.meta.env.VITE_OZ_ACCOUNT_ADDRESS,
    privateKey: import.meta.env.VITE_OZ_PRIVATE_KEY,
    publicKey: import.meta.env.VITE_OZ_PUBLIC_KEY,
  };

  const [classHash, setClassHash] = useState("0x0");
  const [contractAddress, setContractAddress] = useState("0x0");
  const [isDeployed, setIsDeployed] = useState(false);
  const [call, setCall] = useState("[]");

  useEffect(() => {
    const fetchClassHash = async () => {
      const classHash = await helpersClassHash(className);
      setClassHash(classHash);
    };
    fetchClassHash();
  }, [classHash]);

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
  }, [classHash]);

  useEffect(() => {
    if (contractAddress === "0x0") return;
    const provider = new RpcProvider({ nodeUrl: "http://localhost:5173/rpc" });
    const counter = new Contract(CounterABI, contractAddress, provider);
    const call = counter.populate("increment", {});

    setCall(JSON.stringify([call], null, 2));
  }, [isDeployed]);

  useEffect(() => {
    const fetchDeploymentStatus = async () => {
      if (contractAddress === "0x0") return;
      const provider = new RpcProvider({
        nodeUrl: "http://localhost:5173/rpc",
      });
      try {
        const hash = await provider.getClassHashAt(contractAddress);
        if (hash === classHash) {
          setIsDeployed(true);
        } else {
          setIsDeployed(false);
        }
      } catch (e) {
        setIsDeployed(false);
      }
    };
    fetchDeploymentStatus();
  }, [contractAddress]);

  return (
    <>
      <h3>{className}</h3>
      {isDeployed ? (
        <>
          {call}
          <button
            onClick={() => {
              navigator.clipboard.writeText(call);
            }}
          >
            Copy Multicall
          </button>
        </>
      ) : (
        "Class is not declared"
      )}
    </>
  );
}

export default Calls;
