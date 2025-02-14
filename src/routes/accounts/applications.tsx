import { useEffect, useState } from "react";
import {
  acknowledgeChannelRequest,
  acknowledgeChannelRequestResult,
  acknowledgeChannelRequestParams,
  acceptChannel,
  exportPublicKeyToHex,
  acceptChannelParams,
  encryptAndSign,
  acceptChannelUniqueKeys,
  generateEncryptionKey,
  generateChannelID,
  channelRequestUniqueKeys,
  channelUniqueKeys,
  queryMessagesResult,
  queryMessages,
  verify,
  hex2buf,
} from "@0xknwn/connect-api";

const baseURL = import.meta.env.VITE_API_URL || "/api";

// @todo: replace with actual account address
const accountAddress = "0x1";
const generateKey = async (namedCurve = "P-256") => {
  const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve,
    },
    true,
    ["sign", "verify"]
  );
  return { publicKey, privateKey };
};

const generateECDHKey = async (namedCurve = "P-256") => {
  const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve,
    },
    true,
    ["deriveKey", "deriveBits"]
  );
  return { publicKey, privateKey };
};

const importVerifyinghKeyFromHex = async (key: string) => {
  const rawKey = hex2buf(key);
  return window.crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"]
  );
};

enum ConnectionState {
  Initializing = "initializing",
  NoRequests = "norequests",
  APIRequestError = "apirequesterror",
  RequestAcknowledged = "requestacknowledged",
  RequestAccepted = "requestaccepted",
  APIAcceptError = "apiaccepterror",
  ChannelOpened = "channelopened",
  ChannelExpired = "channelexpired",
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
  setReceivedMessages: (messages: { [nonce: string]: boolean }) => void;
  setMessages: (messages: any[]) => void;
};

const connect = async (pin: string, callback: CallbackProps) => {
  const { setConnectionState, setPin, setApp } = callback;
  const keys = await channelRequestUniqueKeys(pin);
  const response = await acknowledgeChannelRequest(baseURL, 1, {
    channelRequestUniqueKeys: keys,
  } as acknowledgeChannelRequestParams);
  if (!response.ok) {
    console.error("Cannot connect to the API: ", response.status);
    setConnectionState(ConnectionState.APIRequestError);
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
    setConnectionState(ConnectionState.APIRequestError);
    setPin("");
    return;
  }
  console.log("Request acknowledged");
  setConnectionState(ConnectionState.RequestAcknowledged);
  setApp(result.result as acknowledgeChannelRequestResult);
};

const accept = async (
  app: acknowledgeChannelRequestResult | null,
  pin6: string,
  callback: CallbackProps
) => {
  if (!app || !app.agentEncryptionPublicKey) {
    console.error("Cannot accept request without agentEncryptionPublicKey");
    return;
  }
  const { setPin4, setConnectionState, setChannelID, setSigner } = callback;
  const pin4 = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  setPin4(pin4);
  setConnectionState(ConnectionState.RequestAccepted);
  const { publicKey: identityPublicKey, privateKey: identityPrivateKey } =
    await generateKey();
  const { publicKey: sharingPublicKey, privateKey: sharingPrivateKey } =
    await generateECDHKey();
  const channelID = generateChannelID();
  const encryptionKey = await generateEncryptionKey(
    sharingPrivateKey,
    app.agentEncryptionPublicKey
  );
  const { encryptedMessage, signature } = await encryptAndSign(
    encryptionKey,
    identityPrivateKey,
    channelID
  );
  const ackChannelKeys = await acceptChannelUniqueKeys(
    pin6,
    pin4,
    app.relyingParty,
    app.signerAccountID,
    app.deadline
  );
  const acceptChannelResult = await acceptChannel(baseURL, 2, {
    acceptChannelUniqueKeys: ackChannelKeys,
    signerPublicKey: await exportPublicKeyToHex(identityPublicKey),
    signerEncryptionPublicKey: await exportPublicKeyToHex(sharingPublicKey),
    signerAccountAddress: accountAddress,
    encryptedChannelIdentifier: encryptedMessage,
    channelIdentifierSignature: signature,
    deadline: app.deadline,
  } as acceptChannelParams);
  if (acceptChannelResult.ok) {
    console.log("Channel accepted");
  }
  const output = await acceptChannelResult.json();
  if (output.error) {
    console.error(output.error);
    return;
  }
  setChannelID(channelID);
  setSigner({
    identityKey: {
      publicKey: identityPublicKey,
      privateKey: identityPrivateKey,
    },
    encryptionKey,
    sharingKey: { publicKey: sharingPublicKey, privateKey: sharingPrivateKey },
  });
};

// @todo: check why we do not receive multiple messages when there are several
// pending messages.
// @todo: automate the query every 5 secs instead of the button click
const query = async (
  app: acknowledgeChannelRequestResult,
  channelID: string,
  receivedMessages: { [nonce: string]: boolean },
  messages: any[],
  callback: CallbackProps
) => {
  if (Math.floor(Date.now() / 1000) >= app.deadline) {
    console.log("Deadline reached, channel has expired");
    const { setConnectionState } = callback;
    setConnectionState(ConnectionState.ChannelExpired);
    return;
  }
  const keys = await channelUniqueKeys(app.relyingParty, channelID);
  const response = await queryMessages(baseURL, 3, {
    channelUniqueKeys: keys,
  });
  if (!response.ok) {
    console.error(await response.json());
    throw new Error("Unexpected Error calling API");
  }
  const payload = await response.json();
  if (payload.error && payload.error.code === -32003) {
    return [];
  }
  if (payload.error) {
    throw new Error("Unexpected Error calling API" + payload.error);
  }
  const result = payload.result as queryMessagesResult;
  const { setReceivedMessages, setMessages } = callback;
  if (Array.isArray(result.messages)) {
    const verifyingKey = await importVerifyinghKeyFromHex(app.agentPublicKey);
    for (let [idx, _] of result.messages.entries()) {
      const message = result.messages[idx];
      const signature = result.messageSignatures[idx];
      const verified = await verify(verifyingKey, message, signature);
      const jsonMessage = JSON.parse(message);
      console.log(
        "receivedMessages",
        jsonMessage.nonce,
        receivedMessages[jsonMessage.nonce]
      );
      if (receivedMessages[jsonMessage.nonce]) {
        continue;
      }
      setReceivedMessages({ ...receivedMessages, [jsonMessage.nonce]: true });
      if (!verified) {
        console.error("Message not verified");
      }
      setMessages([...messages, message]);
    }
  }
};

const Messages = () => {
  const [pin, setPin] = useState("");
  const [pin4, setPin4] = useState("");
  const [app, setApp] = useState({} as acknowledgeChannelRequestResult | null);
  const [signer, setSigner] = useState({} as SignerProps | null);
  const [channelID, setChannelID] = useState("");
  const [connectionState, setConnectionState] = useState(
    ConnectionState.Initializing
  );
  const [receivedMessages, setReceivedMessages] = useState(
    {} as { [nonce: string]: boolean }
  );
  const [messages, setMessages] = useState([] as any[]);
  const callback = {
    setConnectionState,
    setPin,
    setApp,
    setPin4,
    setSigner,
    setChannelID,
    setReceivedMessages,
    setMessages,
  };

  useEffect(() => {
    console.log("=== useEffect ===");
  });

  useEffect(() => {
    console.log("=== useEffect ===");
    if (connectionState === ConnectionState.Initializing) {
      console.log("=== 0 ===");
      return;
    }
    if (connectionState === ConnectionState.NoRequests) {
      console.log("=== 1 ===");
      const interval = setInterval(() => {
        setConnectionState(ConnectionState.Initializing);
      }, 3000);
      return () => clearInterval(interval);
    }
    if (connectionState === ConnectionState.APIAcceptError) {
      console.log("=== 2 ===");
      const interval = setInterval(() => {
        setConnectionState(ConnectionState.Initializing);
        setApp(null);
        setSigner(null);
        setChannelID("");
        setPin("");
        setPin4("");
      }, 3000);
      return () => clearInterval(interval);
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
      ) : connectionState === ConnectionState.APIRequestError ? (
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
          <button onClick={() => accept(app, pin, callback)}>Accept</button>
        </>
      ) : connectionState === ConnectionState.RequestAccepted ? (
        <>
          <p>Request Accepted, use {pin4} on the agent to open the channel</p>
          <button
            onClick={() => {
              setConnectionState(ConnectionState.Initializing);
              setPin("");
              setPin4("");
              setApp(null);
              setSigner(null);
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              setConnectionState(ConnectionState.ChannelOpened);
            }}
          >
            Connect
          </button>
        </>
      ) : connectionState === ConnectionState.APIAcceptError ? (
        <>
          <p>Error accepting Channel...</p>
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
          <button
            onClick={() => {
              if (!app) {
                console.log("no app");
                return;
              }
              query(
                app as acknowledgeChannelRequestResult,
                channelID,
                receivedMessages,
                messages,
                callback
              );
            }}
          >
            Receive
          </button>
          <ul>
            {messages.map((msg, idx) => (
              <li key={idx}>{JSON.stringify(msg)}</li>
            ))}
          </ul>
        </>
      ) : connectionState === ConnectionState.ChannelExpired ? (
        <>
          <p>Channel has expired...</p>
          <button
            onClick={() => {
              setConnectionState(ConnectionState.Initializing);
              setPin("");
              setPin4("");
            }}
          >
            Reconnect
          </button>
        </>
      ) : (
        <p>Stat not managed yet</p>
      )}
    </>
  );
};

export default Messages;
