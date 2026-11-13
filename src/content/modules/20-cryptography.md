---
number: 20
title: Cryptography
summary: The math that protects everything else — symmetric and asymmetric ciphers, hashing, PKI and digital signatures, TLS, applications and real-world uses, plus cryptanalysis and attack countermeasures.
icon: lock
category: Defense & Crypto
readTime: 12
objectives:
  - Distinguish symmetric, asymmetric, and hashing primitives
  - Understand PKI, certificates, and digital signatures
  - Learn where cryptography is applied (TLS, disk, email, VPN)
  - Recognize cryptanalysis and attacks on crypto, and how to defend
tools:
  - { name: OpenSSL, purpose: Swiss-army knife for keys, certs, hashing, and TLS testing, type: Built-in, source: "https://www.openssl.org/" }
  - { name: GnuPG (GPG), purpose: Public-key encryption and signing of files/email, type: Open Source, source: "https://gnupg.org/" }
  - { name: Hashcat, purpose: Hash cracking (assess password/hash strength), type: Open Source, source: "https://hashcat.net/hashcat/" }
  - { name: John the Ripper, purpose: Offline hash cracking and auditing, type: Open Source, source: "https://www.openwall.com/john/" }
  - { name: VeraCrypt, purpose: Full-disk and container encryption, type: Open Source, source: "https://www.veracrypt.fr/" }
  - { name: testssl.sh, purpose: TLS/SSL configuration and vulnerability testing, type: Open Source, source: "https://testssl.sh/" }
  - { name: CyberChef, purpose: Encoding/encryption analysis and transformation, type: Online, source: "https://gchq.github.io/CyberChef/" }
takeaways:
  - Symmetric = one shared key (fast, bulk data); asymmetric = key pair (exchange, signatures).
  - Hashing is one-way and verifies integrity; always salt stored passwords with a slow KDF.
  - PKI + digital signatures provide authenticity and non-repudiation; TLS combines all three.
  - Never roll your own crypto — use vetted libraries, strong algorithms, and correct key management.
---

## Overview

**Cryptography** is the foundation the rest of security stands on — it delivers
confidentiality, integrity, authenticity, and non-repudiation. This module is about using it
correctly and recognizing when it's used *incorrectly* (weak algorithms, bad key management,
poor randomness), which is where most real-world crypto failures live.

## Core Primitives

### Symmetric encryption

One shared secret key encrypts and decrypts. Fast — used for bulk data. Modern choice:
**AES** (128/256, GCM mode for authenticated encryption); **ChaCha20-Poly1305** on mobile.
Avoid legacy **DES/3DES/RC4**. The challenge is securely sharing the key.

### Asymmetric encryption

A **public/private key pair**: encrypt with the public key, decrypt with the private (and
sign with private, verify with public). **RSA**, **ECC** (smaller/faster), and
Diffie-Hellman for key exchange. Slower, so typically used to exchange a symmetric key.

### Hashing

One-way fixed-length digests for **integrity**: **SHA-256/SHA-3** (use these), **MD5/SHA-1**
(broken — collisions). For passwords, use **slow, salted KDFs**: Argon2, bcrypt, scrypt,
PBKDF2. **HMAC** adds a key for authenticated integrity.

## PKI, Signatures & TLS

- **Digital signature** — hash the message, encrypt the hash with your private key; anyone verifies with your public key → authenticity + integrity + non-repudiation.
- **PKI** — Certificate Authorities issue X.509 certificates binding identities to public keys; browsers trust a CA chain.
- **TLS** — combines asymmetric key exchange, symmetric bulk encryption, and certificates to secure the web. Prefer **TLS 1.2/1.3** with forward-secret suites.

## Applications

Disk/file encryption (BitLocker, VeraCrypt, LUKS), email (PGP/S-MIME), VPNs (IPsec,
WireGuard), code signing, and blockchain all build on these primitives.

## Cryptanalysis & Attacks (concepts)

Weaknesses usually come from **implementation and key management**, not breaking the math:
weak/short keys, poor randomness, nonce reuse, padding-oracle and downgrade attacks, side
channels, and hash collisions on deprecated algorithms. Brute-force/dictionary attacks
target weak passwords behind hashes.

## Example Commands

```bash
# Generate an RSA key pair and a self-signed cert (lab)
openssl genrsa -out private.key 4096
openssl req -new -x509 -key private.key -out cert.pem -days 365

# Symmetric encrypt/decrypt a file with AES-256-GCM
openssl enc -aes-256-gcm -salt -pbkdf2 -in secret.txt -out secret.enc
openssl enc -d -aes-256-gcm -pbkdf2 -in secret.enc -out secret.txt

# Hash and HMAC
sha256sum file.iso
openssl dgst -sha256 -hmac "key" file.txt

# Encrypt/sign with GPG
gpg --encrypt --recipient alice@example.com report.pdf
gpg --verify report.pdf.sig report.pdf

# Audit a server's TLS configuration
testssl.sh https://example.com
```

## Countermeasures

- Use **strong, current algorithms** (AES-GCM, SHA-256/3, RSA-3072+/ECC, TLS 1.3) and **vetted libraries** — never roll your own.
- **Key management** is everything: generate with strong randomness, rotate, store in HSMs/KMS, and never hardcode keys.
- **Salt + slow-hash** all stored passwords; use authenticated encryption (AEAD) and unique nonces.
- Test TLS configs, disable legacy protocols/ciphers, and plan for crypto-agility (including post-quantum readiness).
