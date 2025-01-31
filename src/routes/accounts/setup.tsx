import { useAccounts, type account } from "../../helpers/accounts";
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
import { useAuth } from "../../helpers/authn";
import { getKeys } from "../../helpers/encryption";

function Setup() {
  const [deployedStatus, setDeployedStatus] = useState("unknown");

  const {
    accounts,
    addAccount,
    selectedAccountNumber,
    setSelectedAccountNumber,
  } = useAccounts();
  const { passphrase } = useAuth();
  const providerURL = "http://localhost:5173/rpc";

  const runDeployAccount = async () => {
    setDeployedStatus("deploying");
    const provider = new RpcProvider({ nodeUrl: providerURL });
    const { publicKey, privateKey } = await getKeys(
      passphrase,
      selectedAccountNumber
    );
    console.log("publicKey", publicKey);
    console.log("privateKey", privateKey);
    const smartrSigner = new Signer(privateKey);
    const smartrAccountPublicKey = await smartrSigner.getPubKey();
    console.log("smartrAccountPublicKey", smartrAccountPublicKey);
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
    console.log("smartrAccountAddress", smartrAccountAddress);
    const smartrAccount = new SmartrAccount(
      provider,
      smartrAccountAddress,
      privateKey,
      undefined,
      "1",
      "0x3"
    );
    try {
      const address = await deployAccount(
        smartrAccount,
        classNames.SmartrAccount,
        publicKey,
        calldata
      );
      console.log("address", address);
      setDeployedStatus("deployed");
    } catch (e) {
      setDeployedStatus("undeployed");
    }
  };

  useEffect(() => {
    const provider = new RpcProvider({ nodeUrl: providerURL });
    const checkDeployed = async () => {
      try {
        const deployed = await provider.getClassHashAt(
          accounts[selectedAccountNumber].address
        );
        console.log("Deployed: ", deployed);
        setDeployedStatus("deployed");
      } catch (e) {
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
          <button onClick={runDeployAccount}>Deploy Account </button>
        </>
      ) : deployedStatus === "unknown" ? (
        <p>Checking account deployment status...</p>
      ) : (
        <p>Account is being deployed, please wait...</p>
      )}
    </>
  );
}

export default Setup;
