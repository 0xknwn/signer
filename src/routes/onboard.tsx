import { useContext, useState } from "react";
import { Authn } from "../context/authn.tsx";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { encrypt } from "../helpers/encryption";
import { saveOnboard } from "../requests/onboard.ts";

export const Onboard = () => {
  const { credentials, setCredentials } = useContext(Authn);
  const { encrypter, accessToken } = credentials;
  const [selector, setSelector] = useState("new");
  const [mnemonic, setMnemonic] = useState("");
  const [hiddenArea, setHiddenArea] = useState(true);
  const changeSelector = (e: any) => {
    if (e.target.value === "register") {
      setSelector("register");
      setHiddenArea(false);
      return;
    }
    setSelector("new");
    setHiddenArea(true);
  };

  const submit = async () => {
    if (selector === "register") {
      console.log("check the key exists and is valid");
      const isValidMnemonic = bip39.validateMnemonic(mnemonic, wordlist);
      if (!isValidMnemonic) {
        throw new Error("invalid mnemonic");
      }
    } else {
      setMnemonic(bip39.generateMnemonic(wordlist));
    }
    const encryptedData = await encrypt(encrypter, mnemonic);
    if (!accessToken || !accessToken.key) {
      throw new Error("no access token");
    }
    const { key } = accessToken;
    const { managedAccounts } = await saveOnboard(key, encryptedData);
    console.log(managedAccounts);
    setCredentials({
      ...credentials,
      managedAccounts,
    });
  };

  return (
    <>
      <h1>Onboarding: /onboarding</h1>
      <p>Welcome to the onboarding page. You did not save the</p>
      <ul>
        <li>
          <select onChange={changeSelector} value={selector}>
            <option value="new" id="0">
              new...
            </option>
            <option value="register" id="1">
              Register a saved key
            </option>
          </select>
        </li>
        <li>
          <textarea
            hidden={hiddenArea}
            rows={5}
            cols={20}
            onChange={(e) => setMnemonic(e.target.value)}
          ></textarea>
        </li>
        <li>
          <input type="submit" name="save" value="submit" onClick={submit} />
        </li>
      </ul>
    </>
  );
};
