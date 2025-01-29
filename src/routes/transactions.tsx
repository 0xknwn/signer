import NavBar from "../components/navbar";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { RpcProvider, shortString } from "starknet";
import { content } from "./transactions.help";

function Transactions() {
  const [help, setHelp] = useState(false);

  const providerURL = "http://localhost:5173/rpc";
  const provider = new RpcProvider({ nodeUrl: providerURL });

  const [chainId, setChainId] = useState("");

  useEffect(() => {
    (async () => {
      const chain = await getChainId();
      setChainId(shortString.decodeShortString(chain));
    })();
  }, []);

  const getChainId = async () => {
    const chainId = await provider.getChainId();
    console.log("chainId", chainId);
    return chainId.toString();
  };

  return (
    <>
      <NavBar />
      <h1>Transactions</h1>
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
          <button onClick={getChainId}>Get chain id</button>
          <p>Chain id: {chainId}</p>
        </>
      )}
    </>
  );
}

export default Transactions;
