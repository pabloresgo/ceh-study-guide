---
number: 16
title: Hacking Wireless Networks
summary: Wireless security end to end — 802.11 concepts, WEP/WPA/WPA2/WPA3 encryption, the wireless attack methodology, rogue APs and evil twins, and enterprise Wi-Fi hardening.
icon: wifi
category: Infrastructure
readTime: 11
objectives:
  - Understand 802.11 concepts and wireless terminology
  - Compare WEP, WPA, WPA2, and WPA3 and their weaknesses
  - Walk the wireless attack methodology
  - Recognize rogue AP, evil twin, and deauth attacks
  - Apply wireless hardening countermeasures
tools:
  - { name: Aircrack-ng suite, purpose: Capture, deauth, and crack Wi-Fi handshakes, type: Open Source, source: "https://www.aircrack-ng.org/" }
  - { name: Kismet, purpose: Wireless detection, sniffing, and WIDS, type: Open Source, source: "https://www.kismetwireless.net/" }
  - { name: Wifite, purpose: Automated wireless auditing wrapper, type: Open Source, source: "https://github.com/derv82/wifite2" }
  - { name: hcxdumptool / hcxtools, purpose: Capture PMKID/handshakes for offline analysis, type: Open Source, source: "https://github.com/ZerBea/hcxdumptool" }
  - { name: Hashcat, purpose: GPU cracking of captured WPA/WPA2 material, type: Open Source, source: "https://hashcat.net/hashcat/" }
  - { name: Wireshark, purpose: 802.11 frame analysis, type: Open Source, source: "https://www.wireshark.org/" }
  - { name: Airgeddon, purpose: Multi-use wireless auditing framework, type: Open Source, source: "https://github.com/v1s1t0r1sh3r3/airgeddon" }
takeaways:
  - WEP is broken; WPA/WPA2-PSK fall to weak passphrases; WPA3 adds forward secrecy (SAE).
  - Most WPA2 attacks capture a handshake, then crack the passphrase offline — strength matters.
  - Evil-twin/rogue APs attack the client, not the crypto.
  - Defend with WPA3/strong passphrases, 802.1X/EAP, WIPS, and client hygiene.
---

## Overview

**Wireless networks** extend the attack surface beyond the physical perimeter — an attacker
within radio range can observe and interact without plugging in. Security depends almost
entirely on the **encryption/authentication** in use and the strength of its secrets.

## Encryption Standards

| Standard | Status | Notes |
| --- | --- | --- |
| **WEP** | Broken | RC4 + weak IVs; crackable in minutes — never use |
| **WPA** | Deprecated | TKIP; interim fix, superseded |
| **WPA2** | Common | AES-CCMP; strong unless the PSK is weak (offline handshake cracking) |
| **WPA3** | Current | SAE/"Dragonfly" handshake, forward secrecy, resists offline cracking |

**Personal (PSK)** uses a shared passphrase; **Enterprise (802.1X/EAP)** authenticates each
user via a RADIUS server — far stronger and revocable.

## Attack Methodology

1. **Wi-Fi discovery** — scan for SSIDs, channels, encryption, clients.
2. **Monitor mode & capture** — put the adapter in monitor mode and capture frames.
3. **Attack the auth** — capture a WPA handshake/PMKID (often nudged by a deauth), then crack **offline**.
4. **Client-side** — rogue AP / **evil twin** to lure clients and capture credentials.
5. **Post-access** — pivot into the network (ties back to Modules 3–6).

### Common attacks

Deauthentication (forces reconnection to capture a handshake), **rogue AP** (unauthorized AP
on your network), **evil twin** (clone of a legit SSID), **KRACK** (WPA2 key-reinstallation),
and captive-portal phishing.

## Example Commands

```bash
# Put adapter in monitor mode and find networks (authorized audit of your own WLAN)
sudo airmon-ng start wlan0
sudo airodump-ng wlan0mon

# Target one BSSID/channel and capture a WPA handshake
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w cap wlan0mon

# Offline crack of the captured handshake against a wordlist
aircrack-ng -w /usr/share/wordlists/rockyou.txt cap-01.cap
# or capture PMKID and crack with hashcat (mode 22000)
hcxdumptool -i wlan0mon -o pmkid.pcapng
hashcat -m 22000 pmkid.hc22000 /usr/share/wordlists/rockyou.txt
```

## Countermeasures

- Use **WPA3** (or WPA2-AES) with a **long, random passphrase**; disable WEP/TKIP/WPS.
- Prefer **WPA2/3-Enterprise (802.1X/EAP-TLS)** for organizations — per-user, certificate-based, revocable.
- Deploy a **WIPS** to detect rogue/evil-twin APs and deauth floods; segment guest Wi-Fi.
- Client hygiene: disable auto-join to open/known SSIDs; verify captive portals; use VPNs on untrusted Wi-Fi.
