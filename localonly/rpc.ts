// https://dev.to/dailydevtips1/javascript-proxy-the-fetch-api-p15
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

export type starknetRequest = {
  id: number;
  jsonrpc: string;
  method: string;
};

type starknetResponse = {
  id: number;
  jsonrpc: string;
  result: string;
};

const forwardJSONRPC = async (request: starknetRequest) => {
  const res = await fetch(`http://localhost:5050/rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      "accept-language": "*",
    },
    body: JSON.stringify(request),
  });
  const out = (await res.json()) as starknetResponse;
  return out;
};

export default forwardJSONRPC;

//   POST http://localhost:5050/rpc HTTP/1.1
//   host: localhost:5050
//   connection: keep-alive
//   Content-Type: application/json
//   accept: */*
//   accept-language: *
//   sec-fetch-mode: cors
//   user-agent: node
//   accept-encoding: gzip, deflate
//   content-length: 52
//   {
//     "id": 3,
//     "jsonrpc": "2.0",
//     "method": "starknet_chainId"
// }

// HTTP/1.1 200 OK
// content-type: application/json
// content-length: 58
// vary: origin, access-control-request-method, access-control-request-headers
// access-control-allow-origin: *
// {
//     "jsonrpc": "2.0",
//     "id": 3,
//     "result": "0x534e5f5345504f4c4941"
// }

// http://localhost:5173/api/rpc
// curl -d'{ "id": 3, "jsonrpc": "2.0", "method": "starknet_chainId" }' -H 'Content-Type: application/json' -H 'accept: */*' -H 'accept-language: *' -v http://localhost:8080/rpc
// * Host localhost:8080 was resolved.
// * IPv6: ::1
// * IPv4: 127.0.0.1
// *   Trying [::1]:8080...
// * Connected to localhost (::1) port 8080
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
