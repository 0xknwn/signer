import { useEffect } from "react";
import { useAuthn } from "./authn_context";
import {
  type acknowledgeChannelRequestResult,
  type queryMessagesResult,
  channelUniqueKeys,
  queryMessages,
  verify,
  hex2buf,
} from "@0xknwn/connect-api";

const baseURL = "/api/api";

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

const query = async (
  app: acknowledgeChannelRequestResult,
  channelID: string,
  callback: {
    addChannelReceivedMessage: (channelID: string, nonce: string) => void;
    addChannelMessage: (channelID: string, message: any) => void;
    hasChannelReceivedMessage: (channelID: string, nonce: string) => boolean;
  }
) => {
  if (Math.floor(Date.now() / 1000) >= app.deadline) {
    console.log("Deadline reached, channel has expired");
    return;
  }
  const {
    addChannelReceivedMessage,
    addChannelMessage,
    hasChannelReceivedMessage,
  } = callback;
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
  if (Array.isArray(result.messages)) {
    const verifyingKey = await importVerifyinghKeyFromHex(app.agentPublicKey);
    for (let idx in result.messages) {
      const message = result.messages[idx];
      const signature = result.messageSignatures[idx];
      const jsonMessage = JSON.parse(message);
      const verified = await verify(verifyingKey, message, signature);
      if (!verified) {
        console.error("Invalid signature");
        continue;
      }
      if (hasChannelReceivedMessage(channelID, jsonMessage.nonce)) {
        continue;
      }
      addChannelReceivedMessage(channelID, jsonMessage.nonce);
      addChannelMessage(channelID, message);
    }
  }
};

type refresherProps = {
  channelID: string;
  refresh: number;
};

const Refresher = (props: refresherProps) => {
  const { channelID, refresh } = props;
  const { channels, lastChannelQueryTimestamp, setLastChannelQueryTimestamp } =
    useAuthn();
  const {
    addChannelReceivedMessage,
    addChannelMessage,
    hasChannelReceivedMessage,
  } = useAuthn();
  const callback = {
    addChannelReceivedMessage,
    addChannelMessage,
    hasChannelReceivedMessage,
  };

  useEffect(() => {
    if (
      !channels[channelID] ||
      !channels[channelID].dapp ||
      lastChannelQueryTimestamp(channelID) > Math.floor(Date.now() / 1000) - 5
    ) {
      return;
    }
    setLastChannelQueryTimestamp(channelID, Math.floor(Date.now() / 1000));
    query(channels[channelID].dapp, channelID, callback);
  }, [refresh, channelID, channels]);

  return <></>;
};

export default Refresher;
