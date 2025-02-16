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
          setClassHash(accountClassHash(accountClassNames.SmartrAccount));
          break;
        case accountClassNames.StarkValidator:
          setClassHash(accountClassHash(accountClassNames.StarkValidator));
          break;
        case helpersClassNames.Counter:
          setClassHash(helpersClassHash(helpersClassNames.Counter));
          break;
      }
    };
    fetchClassHash();
  }, [classHash, className]);

  useEffect(() => {
    const fetchDeclaredStatus = async () => {
      const provider = new RpcProvider({
        nodeUrl: window.location.origin + "/api/sepolia",
      });
      try {
        const d = await provider.getClassByHash(classHash);
        if (d) {
          setIsDeclared("true");
          return;
        }
        setIsDeclared("false");
      } catch {
        setIsDeclared("false");
      }
    };
    fetchDeclaredStatus();
  }, [classHash]);

  const declareSmartr = async () => {
    setStatus("RUNNING");
    const provider = new RpcProvider({
      nodeUrl: window.location.origin + "/api/sepolia",
    });
    const a = new Account(
      provider,
      seed0z.address,
      seed0z.privateKey,
      "1",
      "0x3"
    );
    switch (className) {
      case accountClassNames.SmartrAccount: {
        const smartrAccountClassHash = await accountDeclareClass(
          a,
          accountClassNames.SmartrAccount
        );
        setClassHash(smartrAccountClassHash.classHash);
        break;
      }
      case accountClassNames.StarkValidator: {
        const starkValidatorClassHash = await accountDeclareClass(
          a,
          accountClassNames.StarkValidator
        );
        setClassHash(starkValidatorClassHash.classHash);
        break;
      }
      case helpersClassNames.Counter: {
        const counterClassHash = await helpersDeclareClass(
          a,
          helpersClassNames.Counter
        );
        setClassHash(counterClassHash.classHash);
        break;
      }
    }
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
        <p>{className.toString()} is already declared</p>
      ) : (
        <p>loading...</p>
      )}
    </>
  );
}

export default Declare;
