import { useAccounts, type account } from "../../helpers/account_context";
import AccountComponent from "../../components/account";
import { useEffect, useState } from "react";
import { RpcProvider, Signer, CallData } from "starknet";
import {
  accountAddress,
  classHash,
  deployAccount,
  SmartrAccount,
  SmartrAccountABI,
  classNames,
} from "@0xknwn/starknet-modular-account";
import { useAuth } from "../../helpers/authn_context";
import { getKeys } from "../../helpers/encryption";

function Setup() {
  const [deployedStatus, setDeployedStatus] = useState("unknown");

  const {
    accounts,
    addAccount,
    selectedAccountNumber,
    setSelectedAccountNumber,
    tokens,
  } = useAccounts();

  const position = (name: string) => {
    return tokens.find((t) => t.name === name) || { value: 0n };
  };

  const { passphrase } = useAuth();
  const providerURL = "http://localhost:5173/rpc";

  const runDeployAccount = async () => {
    setDeployedStatus("deploying");
    const provider = new RpcProvider({ nodeUrl: providerURL });
    const { publicKey, privateKey } = await getKeys(
      passphrase,
      selectedAccountNumber
    );
    const smartrSigner = new Signer(privateKey);
    const smartrAccountPublicKey = await smartrSigner.getPubKey();
    const starkValidatorClassHash = classHash(classNames.StarkValidator);
    const calldata = new CallData(SmartrAccountABI).compile("constructor", {
      core_validator: starkValidatorClassHash,
      args: [smartrAccountPublicKey],
    });
    const smartrAccountAddress = accountAddress(
      classNames.SmartrAccount,
      smartrAccountPublicKey,
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
      await deployAccount(
        smartrAccount,
        classNames.SmartrAccount,
        publicKey,
        calldata
      );
      setDeployedStatus("deployed");
    } catch {
      setDeployedStatus("undeployed");
    }
  };

  useEffect(() => {
    const provider = new RpcProvider({ nodeUrl: providerURL });
    const checkDeployed = async () => {
      try {
        await provider.getClassHashAt(accounts[selectedAccountNumber].address);
        setDeployedStatus("deployed");
      } catch {
        setDeployedStatus("undeployed");
      }
    };
    checkDeployed();
  }, [selectedAccountNumber, accounts]);

  const handleOnChange = (value: string) => {
    setSelectedAccountNumber(parseInt(value));
  };

  const add = async () => {
    const i = accounts.length;
    await addAccount();
    setSelectedAccountNumber(i);
  };

  return (
    <>
      <button onClick={add}>Add account</button>
      {accounts.length > 0 && selectedAccountNumber < accounts.length && (
        <>
          <select
            onChange={(e) => handleOnChange(e.currentTarget.value)}
            value={selectedAccountNumber}
          >
            {accounts.map((a: account, index: number) => (
              <option key={index} value={index}>
                {a.name}
              </option>
            ))}
          </select>
        </>
      )}
      <AccountComponent />
      {deployedStatus === "deployed" ? (
        <p>Account is deployed</p>
      ) : deployedStatus === "undeployed" ? (
        <>
          {BigInt(position("STRK")?.value) < 100000000000000n ? (
            "fund the account with STRK!"
          ) : (
            <button onClick={runDeployAccount}>Deploy Account </button>
          )}
        </>
      ) : deployedStatus === "unknown" ? (
        <p>Checking account deployment status...</p>
      ) : (
        <p>Account is being deployed, please wait...</p>
      )}
      <p>STRK: {position("STRK")?.value}</p>
    </>
  );
}

export default Setup;
