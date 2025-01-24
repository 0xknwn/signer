import Navbar from "../components/navbar.tsx";
import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";

import { content } from "./seed.help";
import { useAuth } from "../helpers/authn.tsx";
import { wordlist } from "@scure/bip39/wordlists/english";
import { validateMnemonic, generateMnemonic } from "@scure/bip39";

const Seed = () => {
  const { mnemonic, setMnemonic } = useAuth();
  const [help, setHelp] = useState(false);
  const [valid, setValid] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [key0, setKey0] = useState("");
  const [key1, setKey1] = useState("");
  const [key2, setKey2] = useState("");
  const [key3, setKey3] = useState("");
  const [key4, setKey4] = useState("");
  const [key5, setKey5] = useState("");
  const [key6, setKey6] = useState("");
  const [key7, setKey7] = useState("");
  const [key8, setKey8] = useState("");
  const [key9, setKey9] = useState("");
  const [key10, setKey10] = useState("");
  const [key11, setKey11] = useState("");
  const [t, setT] = useState("password");

  useEffect(() => {
    if (mnemonic === "") {
      setReadOnly(false);
      return;
    }
    const keys = mnemonic.split(" ");
    if (keys.length !== 12) {
      return;
    }
    setKey0(keys[0]);
    setKey1(keys[1]);
    setKey2(keys[2]);
    setKey3(keys[3]);
    setKey4(keys[4]);
    setKey5(keys[5]);
    setKey6(keys[6]);
    setKey7(keys[7]);
    setKey8(keys[8]);
    setKey9(keys[9]);
    setKey10(keys[10]);
    setKey11(keys[11]);
  }, [mnemonic]);

  const save = () => {
    setMnemonic(
      `${key0} ${key1} ${key2} ${key3} ${key4} ${key5} ${key6} ${key7} ${key8} ${key9} ${key10} ${key11}`
    );
  };

  useEffect(() => {
    if (
      key0 !== "" &&
      key1 !== "" &&
      key2 !== "" &&
      key3 !== "" &&
      key4 !== "" &&
      key5 !== "" &&
      key6 !== "" &&
      key7 !== "" &&
      key8 !== "" &&
      key9 !== "" &&
      key10 !== "" &&
      key11 !== ""
    ) {
      const isValid = validateMnemonic(
        `${key0} ${key1} ${key2} ${key3} ${key4} ${key5} ${key6} ${key7} ${key8} ${key9} ${key10} ${key11}`,
        wordlist
      );
      if (isValid) {
        setValid(true);
      }
      return;
    } else {
      setValid(false);
    }
  }, [
    key0,
    key1,
    key2,
    key3,
    key4,
    key5,
    key6,
    key7,
    key8,
    key9,
    key10,
    key11,
  ]);
  const generate = () => {
    const mnemonic = generateMnemonic(wordlist, 128);
    setMnemonic(mnemonic);
    setReadOnly(true);
  };

  return (
    <>
      <Navbar />
      <h2>Seed</h2>
      <button
        onClick={() => {
          setHelp(!help);
        }}
      >
        {help ? "Hide help" : "Show help"}
      </button>
      {!readOnly && <button onClick={generate}>Generate</button>}
      {help ? (
        <Markdown>{content}</Markdown>
      ) : (
        <>
          <input
            id="key0"
            type={t}
            value={key0}
            onChange={(e) => setKey0(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key1"
            type={t}
            value={key1}
            onChange={(e) => setKey1(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key2"
            type={t}
            value={key2}
            onChange={(e) => setKey2(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key3"
            type={t}
            value={key3}
            onChange={(e) => setKey3(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key4"
            type={t}
            value={key4}
            onChange={(e) => setKey4(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key5"
            type={t}
            value={key5}
            onChange={(e) => setKey5(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key6"
            type={t}
            value={key6}
            onChange={(e) => setKey6(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key7"
            type={t}
            value={key7}
            onChange={(e) => setKey7(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key8"
            type={t}
            value={key8}
            onChange={(e) => setKey8(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key9"
            type={t}
            value={key9}
            onChange={(e) => setKey9(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key10"
            type={t}
            value={key10}
            onChange={(e) => setKey10(e.target.value)}
            readOnly={readOnly}
          />
          <input
            id="key11"
            type={t}
            value={key11}
            onChange={(e) => setKey11(e.target.value)}
            readOnly={readOnly}
          />
          <button
            id="toggle"
            type="button"
            onMouseUp={() => {
              setT("password");
            }}
            onMouseLeave={() => {
              setT("password");
            }}
            onMouseDown={() => {
              setT("text");
            }}
          >
            {t === "password" ? "Show Seed" : "Hide Seed"}
          </button>
          {!readOnly && (
            <button id="save" type="button" onClick={save} disabled={!valid}>
              Save
            </button>
          )}
          <p>{!valid ? "Invalid Mnemonic" : ""}</p>
        </>
      )}
    </>
  );
};

export default Seed;
