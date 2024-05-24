import { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { verify } from "../requests/verify.ts";
import { useContext, ReactNode } from "react";
import { Authn } from "../context/authn.tsx";

export class VerifyRequest {
  email: string | null | undefined;
  verification_key: string | null | undefined;

  constructor(payload: any) {
    if (!payload) {
      return;
    }
    const { email, verification_key } = payload;
    this.email = email;
    this.verification_key = verification_key;
  }

  isValid(): boolean {
    return this?.email && this?.verification_key ? true : false;
  }
}

type Props = {
  children: ReactNode;
};

const Text = ({ children }: Props) => {
  const { setCredentials } = useContext(Authn);

  const reset = () => {
    setCredentials({
      accessToken: null,
      signer: null,
      encrypter: null,
      email: null,
      managedAccounts: null,
    });
  };

  return (
    <>
      <p>
        There is no active account with the credentials you have just provided.
        There are several reasons why this could be the case:
      </p>
      <ul>
        <li>
          You have just created the account and you have not verified your email
          yet. If that is your case, you should check your mailbox and enter the
          verification code you have received. {children}
        </li>
        <li>
          You have typed the wrong credentials. We do not keep any track of your
          password and it is likely you did a typo. Get back to the{" "}
          <Link to="#" onClick={reset}>
            signin
          </Link>{" "}
          page and try to reconnect...
        </li>
        <li>
          You have lost or forgotten your credentials. If that is the case and
          you have setup a guardian, you can request a password reset. It will
          take a few days and you will need to confirm by email but, at least,
          you have not lost your account yet!
        </li>
        <li>
          You are trying to hack an account. TL;DR: don't do that! That is a
          crime and we will do whatever we can to prevent this, including
          procecute you. And by the way, we won't even tell you if what you are
          trying to hacked actually exists. Do not loose your time here...
        </li>
        <li>
          You have found a bug! We can investigate your issue but you will have
          to sign a challenge with your credentials to help us better diagnose
          the issue. Feel free to open an issue on our repository.
        </li>
        <li>
          Something has been hacked: it could be your account credentials, your
          email or even our platform. If that is the case, there should still be
          a way to recover your account. Check the documentation.
        </li>
      </ul>
    </>
  );
};

export const Verify = () => {
  const { credentials, setCredentials } = useContext(Authn);

  const [status, setStatus] = useState(0);
  const [verifyCode, setVerifyCode] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setVerifyCode(e.target.value);

  const handleClick = async () => {
    const {
      status: outputStatus,
      key,
      expiresAt,
    } = await verify(credentials.email || "", verifyCode);
    if (outputStatus === 200) {
      if (!key || !expiresAt) {
        setStatus(400);
        return;
      }
      setCredentials({
        ...credentials,
        accessToken: { key, expiresAt },
      });
      setStatus(200);
      return;
    }
    setStatus(outputStatus);
  };

  useEffect(() => {
    if (status === 0 || status === 200) {
      return;
    }
    setCredentials({
      ...credentials,
      email: null,
      signer: null,
      encrypter: null,
    });
  }, [status, credentials]);

  return (
    <>
      <Link to="/">back</Link>
      <h1>Verify: /verify</h1>
      <Text>
        <form>
          <label>
            Verification Code :
            <input
              type="text"
              onChange={handleChange}
              name="code"
              value={verifyCode}
            />
          </label>
          <input
            type="button"
            onClick={handleClick}
            name="verify"
            value="verify"
          />
          <div hidden>{status}</div>
        </form>
      </Text>
    </>
  );
};
