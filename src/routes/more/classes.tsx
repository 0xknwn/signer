import Declare from "../../components/classes/declare";
import { classNames as accountClassNames } from "@0xknwn/starknet-modular-account";
import { classNames as helpersClassNames } from "@0xknwn/starknet-test-helpers";

function Classes() {
  return (
    <>
      <h2>Declare</h2>
      <Declare className={accountClassNames.SmartrAccount} />
      <Declare className={accountClassNames.StarkValidator} />
      <Declare className={helpersClassNames.Counter} />
    </>
  );
}

export default Classes;
