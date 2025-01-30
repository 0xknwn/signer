import { useState, useEffect } from "react";
import { Account, RpcProvider } from "starknet";
import {
  declareClass as accountDeclareClass,
  classNames as accountClassNames,
  classHash as accountClassHash,
} from "@0xknwn/starknet-modular-account";
import {
  declareClass as helpersDeclareClass,
  classNames as helpersClassNames,
  classHash as helpersClassHash,
} from "@0xknwn/starknet-test-helpers";

type Props = {
  className: accountClassNames | helpersClassNames;
};

function Declare({ className }: Props) {
  const seed0z = {
    address: import.meta.env.VITE_OZ_ACCOUNT_ADDRESS,
    privateKey: import.meta.env.VITE_OZ_PRIVATE_KEY,
    publicKey: import.meta.env.VITE_OZ_PUBLIC_KEY,
  };

  const [isDeclared, setIsDeclared] = useState("init");
  const [classHash, setClassHash] = useState("0x0");
  const [status, setStatus] = useState("unknown");

  useEffect(() => {
    const fetchClassHash = async () => {
      switch (className) {
        case accountClassNames.SmartrAccount:
        case accountClassNames.StarkValidator:
          const accountHash = await accountClassHash(className);
          setClassHash(accountHash);
          break;
        case helpersClassNames.Counter:
          const helperHash = await helpersClassHash(className);
          setClassHash(helperHash);
          break;
      }
    };
    fetchClassHash();
  }, [classHash]);

  useEffect(() => {
    const fetchDeclaredStatus = async () => {
      const provider = new RpcProvider({
        nodeUrl: "http://localhost:5173/rpc",
      });
      const d = await provider.getClassByHash(classHash);
      if (d) {
        setIsDeclared("true");
        return;
      }
      setIsDeclared("false");
    };
    fetchDeclaredStatus();
  }, [classHash]);

  const declareSmartr = async () => {
    setStatus("RUNNING");
    const provider = new RpcProvider({ nodeUrl: "http://localhost:5173/rpc" });
    const a = new Account(
      provider,
      seed0z.address,
      seed0z.privateKey,
      "1",
      "0x3"
    );
    let classHash = "0x0";
    switch (className) {
      case accountClassNames.SmartrAccount:
      case accountClassNames.StarkValidator:
        const { classHash: accountClassHash } = await accountDeclareClass(
          a,
          className
        );
        classHash = accountClassHash;
        break;
      case helpersClassNames.Counter:
        const { classHash: helpersClassHash } = await helpersDeclareClass(
          a,
          className
        );
        classHash = helpersClassHash;
        break;
    }
    setClassHash(classHash);
    setStatus("SUCCEEDED");
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
            <input type="text" value={classHash} readOnly />
          </>
        );
      default:
        return (
          <>
            <input type="text" value={classHash} readOnly />
          </>
        );
    }
  };

  return (
    <>
      {isDeclared == "false" ? (
        <>
          <button onClick={declareSmartr}>{className.toString()}</button>
          {printStatus()}
        </>
      ) : isDeclared == "true" ? (
        <p>account is already declared</p>
      ) : (
        <p>loading...</p>
      )}
    </>
  );
}

export default Declare;
