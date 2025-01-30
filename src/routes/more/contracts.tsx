import Deploy from "../../components/deploy";
import { classNames as helpersClassNames } from "@0xknwn/starknet-test-helpers";

function Contracts() {
  return (
    <>
      <h2>Deploy</h2>
      <Deploy className={helpersClassNames.Counter} />
    </>
  );
}

export default Contracts;
