import { useAuthn } from "../../../helpers/authn_context";
const ChannelList = () => {
  const { channels } = useAuthn();
  return (
    <>
      <h2>List of Channels</h2>
      {Object.keys(channels).map((channelID) => (
        <ul key={channelID}>
          <li>channelID: {channelID}</li>
          <li>URL: {channels[channelID].dapp?.relyingParty}</li>
          <li>Expires: {channels[channelID].dapp?.deadline}</li>
        </ul>
      ))}
    </>
  );
};

export default ChannelList;
