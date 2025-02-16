import { useAuthn } from "../../../helpers/authn_context";
const ChannelList = () => {
  const { channels, messages } = useAuthn();
  return (
    <>
      <h2>List of Channels</h2>
      {Object.keys(channels).map((channelID) => (
        <ul key={channelID}>
          <li key={channelID + "/channel"}>channelID: {channelID}</li>
          <li key={channelID + "/url"}>
            URL: {channels[channelID].dapp?.relyingParty}
          </li>
          <li key={channelID + "/expires"}>
            Expires: {channels[channelID].dapp?.deadline}
          </li>
          <li key={channelID + "/messages"}>
            <ul key={channelID + "/channel/messages"}>
              {messages[channelID]?.map((v) => (
                <li key={v.nonce}>{v}</li>
              ))}
            </ul>
          </li>
        </ul>
      ))}
    </>
  );
};

export default ChannelList;
