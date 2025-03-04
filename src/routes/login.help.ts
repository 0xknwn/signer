export const content = `
Signin to the extension is mandatory. Its creates an encryption key that can be
used to secure a passphrase, aka a set of 12 words that matches the BIP39
standard. The encryption/decryption key is generated from the PBKDF2 algorithm
by derivation. The associated operations consist in (a) the initial login, (b)
the login, (c) the generation or entering of a passphrase, (d) the
acknowledgement and check of the existing passphrase and (f) the reset of a
passphrase.

## Initial Login

If you have never connected before OR if you have reset the login, you will
always access the Initial Login form. This forms provides the following feature.

- It requests you enter a username and a password 2x to confirm. The reason you
  should enter the password x2 is because there is no way to recover it.
- The username is stored locally to be proposed at the login page.
- Once you have generate the key with the username and password, it stores a
  fingerprint to make sure you can regenerate the key later on.
- Once the setup has been done the login page will open to make sure you can
  connect with the username and password you have just entered.
- Note that in case you do the initial login again, nothing prevents you from
  using the same set of username/password.  

## Login

The login page allows people to connect to the extension:

- It is a form that consists in the username that is saved in the page and does
  not require to be typed again. It also consists in a password.
- To verify the login/password are correct, the login page will use the
  fingerprint. Assuming it the the case, the application can request you to
  generate the passphrase, if it has never been done before. If a passphrase
  exists it can grant you access to the network and account selection.
- The login page also provides a way to reset the login. If you decide to
  proceed with the reset (it requires a double validation and warns that the
  passphrase will be erased), the application will erase everything and redirect
  to the initial login page.
- When the login succeeds and no passphrases exist yet, it reditects you to the
  passphrase generation
- When the login succeeds and no passphrases exist yet, it reditects you to the
  Network and Account Management Page

## Generation of the Passphrase

This operation enables the user to generate a passphrase or to enter an existing
passphrase. It consists in the following:

- Provide a choice to generate a passphrase or to enter an existing one.
- If the user decides to generate a passphrase, the application will generate a
  12-word passphrase that matches the BIP39 standard.
- If the user decides to enter an existing passphrase, the application will ask
  to enter the passphrase and confirm it is correct.

## Acknowlegement and Review of the Passphrase

The user must click on a checkbox and a button to acknowlege the passphrase must
be saved and the signer does not provide any way to recover it. In addition:

- The user can access the passphrase again so that it can be saved.
- The user can still access the screen even after he has acknowleged the
  passphrase must be saved. That is to recover a passphrase with a backup that
  has been lost.

## Reset of the Passphrase

A user cannot reset a passphrase. Instead he will have to reset the login and go
back to the initial login page. To proceed, he has to logout and request the
reset of the login on the login page.
`;
