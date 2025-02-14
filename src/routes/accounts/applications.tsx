import { useEffect, useState } from "react";
import {
  acknowledgeChannelRequest,
  acknowledgeChannelRequestResult,
  acknowledgeChannelRequestParams,
  // acceptChannel,
  // acceptChannelResult,
  // acceptChannelParams,
  generateEncryptionKey,
  generateChannelID,
  channelRequestUniqueKeys,
} from "@0xknwn/connect-api";

const baseURL = import.meta.env.VITE_API_URL || "/api";

enum ConnectionState {
  Initializing = "initializing",
  NoRequests = "norequests",
  APIError = "apierror",
  RequestAcknowledged = "requestacknowledged",
  RequestAccepted = "requestaccepted",
  ChannelOpened = "channelopened",
}

type SignerProps = {
  identityKey: CryptoKeyPair;
  sharingKey: CryptoKeyPair;
  encryptionKey: CryptoKey;
};

type CallbackProps = {
  setConnectionState: (state: ConnectionState) => void;
  setPin: (pin: string) => void;
  setPin4: (pin: string) => void;
  setApp: (app: acknowledgeChannelRequestResult | null) => void;
  setSigner: (signer: SignerProps | null) => void;
  setChannelID: (channelID: string) => void;
};

const connect = async (pin: string, callback: CallbackProps) => {
  const { setConnectionState, setPin, setApp } = callback;
  const keys = await channelRequestUniqueKeys(pin);
  const response = await acknowledgeChannelRequest(baseURL, 1, {
    channelRequestUniqueKeys: keys,
  } as acknowledgeChannelRequestParams);
  if (!response.ok) {
    console.error("Cannot connect to the API: ", response.status);
    setConnectionState(ConnectionState.APIError);
    setPin("");
    return;
  }
  const result = await response.json();
  if (result.error && result.error.code === -32001) {
    setConnectionState(ConnectionState.NoRequests);
    setPin("");
    return;
  }
  if (result.error) {
    console.error("API Error: ", result.error);
    setConnectionState(ConnectionState.APIError);
    setPin("");
    return;
  }
  setConnectionState(ConnectionState.RequestAcknowledged);
  setApp(result.result as acknowledgeChannelRequestResult);
};

const accept = async (
  app: acknowledgeChannelRequestResult | null,
  callback: CallbackProps
) => {
  if (!app || !app.agentEncryptionPublicKey) {
    console.error("Cannot accept request without agentEncryptionPublicKey");
    return;
  }
  const { setPin4, setConnectionState, setChannelID, setSigner } = callback;
  const code4 = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, "0");
  setPin4(code4);
  setConnectionState(ConnectionState.RequestAccepted);
  const channelID = generateChannelID();
  setChannelID(channelID);
  const sharingKey = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"]
  );
  const signingKey = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  );
  const encryptionKey = await generateEncryptionKey(
    sharingKey.privateKey,
    app?.agentEncryptionPublicKey
  );
  setSigner({
    identityKey: signingKey,
    encryptionKey,
    sharingKey,
  });
  // const response = await acceptChannel(baseURL, 1, {
  //   channelID,
  //   encryptionKey,
  //   sharingKey,
  //   signingKey,
  // } as acceptChannelParams);
};

function Messages() {
  const [pin, setPin] = useState("");
  const [pin4, setPin4] = useState("");
  const [app, setApp] = useState({} as acknowledgeChannelRequestResult | null);
  const [signer, setSigner] = useState({} as SignerProps | null);
  const [channelID, setChannelID] = useState("");
  const [connectionState, setConnectionState] = useState(
    ConnectionState.Initializing
  );
  const callback = {
    setConnectionState,
    setPin,
    setApp,
    setPin4,
    setSigner,
    setChannelID,
  };
  useEffect(() => {
    if (connectionState === ConnectionState.Initializing) {
      return;
    }
    if (connectionState === ConnectionState.NoRequests) {
      setInterval(() => {
        console.log("Polling for messages");
        setConnectionState(ConnectionState.Initializing);
      }, 3000);
      return;
    }
    return;
  }, [connectionState]);

  return (
    <>
      <h2>Connect to an Application</h2>
      {connectionState === ConnectionState.Initializing ? (
        <>
          <input
            type="text"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
            }}
          />
          <button onClick={() => connect(pin, callback)}>Connect</button>
        </>
      ) : connectionState === ConnectionState.NoRequests ? (
        <p>No request found...</p>
      ) : connectionState === ConnectionState.APIError ? (
        <p>Error calling API...</p>
      ) : connectionState === ConnectionState.RequestAcknowledged ? (
        <>
          <h3>Please Acknowledge those info:</h3>
          <ul>
            <li>relyingParty: {app?.relyingParty}</li>
            <li>agentAccountAddress: {app?.agentAccountAddress}</li>
            <li>agentEncryptionPublicKey: {app?.agentEncryptionPublicKey}</li>
            <li>agentPublicKey: {app?.agentPublicKey}</li>
            <li>deadline: {app?.deadline}</li>
            <li>signerAccountID: {app?.signerAccountID}</li>
          </ul>
          <button
            onClick={() => {
              setConnectionState(ConnectionState.Initializing);
              setPin("");
            }}
          >
            Disconnect
          </button>
          <button onClick={() => accept(app, callback)}>Accept</button>
        </>
      ) : connectionState === ConnectionState.RequestAccepted ? (
        <>
          <p>Request Accepted, use {pin4} on the agent to open the channel</p>
          <button
            onClick={() => {
              setConnectionState(ConnectionState.ChannelOpened);
              setPin("");
              setPin4("");
            }}
          >
            OK
          </button>
        </>
      ) : connectionState === ConnectionState.ChannelOpened ? (
        <>
          <p>Channel Opened: {channelID}</p>
          <p>keys {signer ? "exist" : "do not exist"}</p>
          <button
            onClick={() => {
              setConnectionState(ConnectionState.Initializing);
              setPin("");
              setPin4("");
            }}
          >
            Reset
          </button>
        </>
      ) : (
        <p>Stat not managed yet</p>
      )}
    </>
  );
}

export default Messages;
