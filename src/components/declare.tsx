import { useState } from "react";
import { Account, RpcProvider } from "starknet";
import {
  declareClass as accountDeclareClass,
  classNames as accountClassNames,
} from "@0xknwn/starknet-modular-account";
import {
  declareClass as helpersDeclareClass,
  classNames as helpersClassNames,
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

  const [classHash, setClassHash] = useState("0x0");
  const [status, setStatus] = useState("unknown");

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
      <button onClick={declareSmartr}>{className.toString()}</button>
      {printStatus()}
    </>
  );
}

export default Declare;
