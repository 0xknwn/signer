export type request = {
  id: number;
  jsonrpc: string;
  method: string;
};

type response = {
  id: number;
  jsonrpc: string;
  result: string;
};

const forward = async (request: request) => {
  const res = await fetch(`http://localhost:5050/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      "accept-language": "*",
    },
    body: JSON.stringify(request),
  });
  const out = (await res.json()) as response;
  return out;
};

export default forward;

// Note to improve that forward function, you can use the following code:
// - https://dev.to/dailydevtips1/javascript-proxy-the-fetch-api-p15
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
//
// examples of requests:
// 1- starknet_chainId
// curl -d'{ "id": 3, "jsonrpc": "2.0", "method": "starknet_chainId" }' \
//   -H 'Content-Type: application/json' \
//   -H 'accept: */*' -H 'accept-language: *' \
//   -v http://localhost:8080/rpc
//
// > POST /rpc HTTP/1.1
// > Host: localhost:8080
// > User-Agent: curl/8.7.1
// > Content-Type: application/json
// > accept: */*
// > accept-language: *
// > Content-Length: 59
// >
// * upload completely sent off: 59 bytes
// < HTTP/1.1 200 OK
// < content-type: application/json
// < content-length: 58
// < vary: origin, access-control-request-method, access-control-request-headers
// < access-control-allow-origin: *
// < date: Wed, 29 Jan 2025 06:49:20 GMT
// <
// * Connection #0 to host localhost left intact
// {"jsonrpc":"2.0","id":3,"result":"0x534e5f5345504f4c4941"}
