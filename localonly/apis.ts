import { apiT } from "./plugin";

import version from "../_api/version";
import rpc from "./rpc";

const apis: apiT[] = [{ route: "version", handler: version }];

export default apis;
