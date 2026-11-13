---
number: 12
title: Evading IDS, Firewalls, and Honeypots
summary: How detection and perimeter controls work — IDS/IPS, firewalls, NAC, and honeypots — the evasion techniques attackers attempt, and how defenders harden and detect against them.
icon: wall
category: Defense & Crypto
readTime: 11
objectives:
  - Describe IDS/IPS, firewall types, NAC, and honeypots
  - Understand common evasion techniques at network and application layers
  - Recognize how honeypots detect and study attackers
  - Harden detection so evasion attempts are themselves detected
tools:
  - { name: Snort, purpose: Signature-based IDS/IPS, type: Open Source, source: "https://www.snort.org/" }
  - { name: Suricata, purpose: High-performance IDS/IPS/NSM engine, type: Open Source, source: "https://suricata.io/" }
  - { name: Zeek (Bro), purpose: Network-security monitoring and protocol analysis, type: Open Source, source: "https://zeek.org/" }
  - { name: Nmap, purpose: Evasion options — fragmentation, decoys, timing, source-port, type: Open Source, source: "https://nmap.org/book/man-bypass-firewalls-ids.html" }
  - { name: fragroute, purpose: Packet fragmentation/reassembly testing against IDS, type: Open Source, source: "https://www.monkey.org/~dugsong/fragroute/" }
  - { name: pfSense, purpose: Open-source firewall/router platform, type: Open Source, source: "https://www.pfsense.org/" }
  - { name: T-Pot / Honeyd, purpose: Honeypot platforms to lure and study attackers, type: Open Source, source: "https://github.com/telekom-security/tpotce" }
takeaways:
  - IDS detects; IPS detects and blocks; firewalls filter; honeypots lure and observe.
  - Most evasion relies on ambiguity — fragmentation, encoding, timing, and encryption that confuse signatures.
  - Honeypots have no legit users, so any interaction with one is suspicious by definition.
  - "Defense: combine signature + anomaly detection, normalize traffic, decrypt where lawful, and tune rules."
---

## Overview

Perimeter and detection controls decide what traffic is allowed and what gets flagged.
Attackers try to slip past them; defenders study those evasion techniques precisely so the
attempts themselves become detections.

## The Controls

- **Firewall** — filters traffic by policy. Types: packet-filter, stateful, application/proxy, and next-gen (NGFW with app awareness + IPS).
- **IDS** (Intrusion Detection System) — alerts on suspicious traffic; **signature-based** (known patterns) or **anomaly-based** (deviations from baseline). Network (NIDS) or host (HIDS).
- **IPS** — an inline IDS that can **block** in real time.
- **NAC** (Network Access Control) — enforces posture/identity before granting network access.
- **Honeypot** — a decoy system with no production purpose; any interaction is inherently suspicious. Low- vs. high-interaction; honeynets chain several.

## Evasion Techniques (concepts)

Attackers exploit differences between how a security device and the end host interpret
traffic:

- **Fragmentation & reassembly ambiguity** — split payloads so the IDS and host reassemble differently.
- **Encoding/obfuscation** — URL/Unicode/hex encoding, case tricks, and polymorphism to dodge signatures.
- **Timing/slow attacks** — spread activity out to stay under thresholds.
- **Decoys & spoofing** — hide the real source among many (`nmap -D`).
- **Source-port manipulation** — pose as trusted ports (e.g. 53/80).
- **Tunneling & encryption** — wrap traffic in HTTPS/DNS/ICMP so inspection can't see it.
- **Evading honeypots** — attackers fingerprint decoys (odd services, VM artifacts) and avoid them.

## Example (authorized testing of your own IDS/firewall)

```bash
# Nmap evasion options (test what your own sensors catch)
sudo nmap -f 10.0.0.5                       # fragment packets
sudo nmap -D RND:5 10.0.0.5                  # decoy sources
sudo nmap --source-port 53 10.0.0.5          # masquerade as DNS
sudo nmap -T1 10.0.0.5                        # slow timing to evade thresholds

# Validate a Snort/Suricata rule fires as expected
sudo snort -q -A console -c /etc/snort/snort.conf -r test.pcap
suricata -r test.pcap -S custom.rules -l ./logs
```

## Countermeasures

- Run **both** signature and anomaly detection; keep rules/signatures current and tuned to cut false positives.
- **Normalize/reassemble** traffic at the sensor (target-based reassembly) to kill fragmentation tricks.
- **Decrypt-and-inspect** where lawful (TLS inspection) so encryption can't hide payloads.
- Deploy **honeypots/canaries** internally — alerts from them are high-fidelity.
- Centralize logs to a SIEM and correlate perimeter + host telemetry; alert on evasion signatures (decoys, odd fragmentation, source-port spoofing).
