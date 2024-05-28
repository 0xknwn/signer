import { useContext, useEffect, useState } from "react";
import { Authn } from "../context/authn.tsx";
import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { encrypt, getKeys } from "../helpers/encryption";
import { saveOnboard } from "../requests/onboard.ts";
import { Link } from "react-router-dom";

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

  const logout = () => {
    setCredentials({});
  };

  const submit = async () => {
    if (selector === "register") {
      const isValidMnemonic = bip39.validateMnemonic(mnemonic, wordlist);
      if (!isValidMnemonic) {
        throw new Error("invalid mnemonic");
      }
    }
    let mn = mnemonic;
    if (selector === "new") {
      mn = bip39.generateMnemonic(wordlist);
    }
    if (!encrypter) {
      throw new Error("no encrypter");
    }
    const encryptedData = await encrypt(encrypter, mn);
    if (!accessToken || !accessToken.key) {
      throw new Error("no access token");
    }
    const { key } = accessToken;
    const { publicKey } = getKeys(mn);
    const { managedAccounts } = await saveOnboard(key, encryptedData, {
      mainnet: [{ address: "0x0", publicKey: publicKey }],
    });
    setCredentials({
      ...credentials,
      managedAccounts,
    });
  };

  return (
    <>
      <Link to="#" onClick={logout}>
        Logout
      </Link>
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
