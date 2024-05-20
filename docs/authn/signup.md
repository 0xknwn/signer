

/signup collect data and generates an entry in the database that is indexed
by the public key #0 of the user. It contains the email, is_verified, color
and a nickname. It contains: (1) the cyphered data and (2) accounts

If the email does not already exists in the database, it creates the entry. If
it exists, it just uses username/password as a key like in /signin. The other
info are lost.

It derives the key and send it with the email to auth.
