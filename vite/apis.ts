import { apiT } from "./plugin";

import version from "../_api/version";
const apis: apiT[] = [{ route: "version", handler: version }];

export default apis;
