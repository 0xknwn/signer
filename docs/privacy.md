# Privacy and personal data

Data are collected to provide our service. This document details those data. It
also explains how they are used and protected.

### Private data

Signin to our service requires you acknowlege we store a number of private data.

- an Email
- a public key, we call #0, that is derived from your credentials
- a nickname
- a color
- a set of account addresses
- a secret that is smaller than 10k in size. This secret is encrypted via
  AES-GCM and we do **NOT** track
- an Initialization Vector (IV) that is required and not sufficient ti recover
  your secret.

## Indexed data

In addition to the private data, we also track some public data that can be
found on the blockchain. Those include:

- transaction history
- events
- the current positions of different kind of token for an account

Those informations can be publicly found on networks and are considered as
public even if, in those cases, they are sensitive, especially if you can
link them to the person that is holding those.

### Liability

We do not use any know-your-customer procedure with our users, like many other
services. The reason is that we do not store any data that would allow us to
access your assets. Yet:

- We are liable for what we do and we can be prosecuted if we do not comply with
  the law. This includes being held responsible for not doing everything
  possible to protect your assets.
- Everybody that is using our service legally or illegally is also suject to the
  law. If someone is trying to access 
