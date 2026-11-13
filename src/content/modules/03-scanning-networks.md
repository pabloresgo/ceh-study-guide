---
number: 3
title: Scanning Networks
summary: Turning a target map into a live picture — host discovery, port and service scanning, OS fingerprinting and banner grabbing, and techniques for scanning around IDS and firewalls.
icon: radar
category: Reconnaissance
readTime: 12
objectives:
  - Discover live hosts and map the network
  - Understand TCP/UDP scan types and when each is appropriate
  - Perform service/version detection and OS fingerprinting
  - Use timing, fragmentation, and decoys to scan more stealthily
  - Apply scanning detection and prevention countermeasures
tools:
  - { name: Nmap, purpose: The reference scanner — host discovery, port/service/OS detection, NSE scripting, type: Open Source, source: "https://nmap.org/" }
  - { name: Masscan, purpose: Internet-scale asynchronous port scanner, type: Open Source, source: "https://github.com/robertdavidgraham/masscan" }
  - { name: RustScan, purpose: Fast port scanner that feeds results into Nmap, type: Open Source, source: "https://github.com/RustScan/RustScan" }
  - { name: Zenmap, purpose: Official Nmap GUI with topology view, type: Open Source, source: "https://nmap.org/zenmap/" }
  - { name: hping3, purpose: Custom TCP/IP packet crafting and firewall testing, type: Open Source, source: "https://github.com/antirez/hping" }
  - { name: Angry IP Scanner, purpose: Lightweight cross-platform host/port scanner, type: Open Source, source: "https://angryip.org/" }
  - { name: Netcat, purpose: Banner grabbing and raw TCP/UDP connections, type: Built-in, source: "https://nmap.org/ncat/" }
  - { name: Unicornscan, purpose: Asynchronous stimulus-response scanning, type: Open Source, source: "https://github.com/dneufeld/unicornscan" }
takeaways:
  - A TCP three-way handshake (SYN→SYN/ACK→ACK) underlies most scan logic.
  - SYN "half-open" scanning is the default fast, relatively stealthy technique.
  - Service/version detection and OS fingerprinting prioritize which hosts to attack.
  - Timing templates, fragmentation, and decoys trade speed for stealth around IDS/firewalls.
---

## Overview

**Scanning** moves from "what might exist" to "what is actually reachable." You confirm
which hosts are alive, which ports are open, what services and versions run behind them,
and what operating systems they use. The output is the prioritized target list the
exploitation phase works from.

## Key Concepts

### TCP flags and the handshake

A normal TCP connection is **SYN → SYN/ACK → ACK**. Scanners manipulate the flags
(SYN, ACK, FIN, RST, PSH, URG) to infer port state from how the target responds.

### Port states and scan types

| Scan | How it works | Notes |
| --- | --- | --- |
| **TCP connect** (`-sT`) | Completes the full handshake | Reliable, but logged |
| **SYN / half-open** (`-sS`) | Sends SYN, never finishes | Default; fast and quieter |
| **UDP** (`-sU`) | Sends UDP, infers from ICMP unreachable | Slow; needed for DNS/SNMP/DHCP |
| **FIN / NULL / Xmas** (`-sF/-sN/-sX`) | Odd flag combos | Can slip past simple filters |
| **ACK** (`-sA`) | Maps firewall rules (filtered vs. unfiltered) | Doesn't find open ports |
| **Idle/zombie** (`-sI`) | Spoofs via a third host's IP ID | Very stealthy, situational |

### Beyond ports

- **Service/version detection** (`-sV`) identifies exactly what's listening.
- **OS fingerprinting** (`-O`) compares TCP/IP stack quirks (TTL, window size, flags) to a signature DB.
- **Banner grabbing** reads the service's own self-identification.

### Scanning around IDS/firewalls

Timing templates (`-T0`–`-T5`), packet **fragmentation** (`-f`), **decoys** (`-D`),
source-port spoofing (`--source-port`), and MTU tweaks reduce the chance of detection —
covered in depth in Module 12.

## Example Commands

```bash
# Host discovery only (ping sweep) — no port scan
nmap -sn 192.168.1.0/24

# Default SYN scan of the top 1000 ports
sudo nmap -sS 192.168.1.10

# Service/version + OS detection + default scripts (a strong all-rounder)
sudo nmap -sS -sV -O -sC -p- 192.168.1.10

# UDP scan of common UDP services
sudo nmap -sU --top-ports 50 192.168.1.10

# Stealthier: slow timing, fragmented packets, with decoys
sudo nmap -sS -T2 -f -D RND:5 192.168.1.10

# Huge ranges fast, then hand off to Nmap for detail
masscan -p1-65535 192.168.1.0/24 --rate 10000

# Manual banner grab
nc -nv 192.168.1.10 22
```

## Countermeasures

- Expose only required ports; filter the rest at the host and network firewall.
- Deploy IDS/IPS and rate-limiting to detect sweeps and half-open floods.
- Disable or sanitize service **banners**; keep versions patched so fingerprints reveal less.
- Use network segmentation so a scan from one zone can't enumerate another.
- Monitor for the telltale signatures of scanners (sequential ports, decoy patterns, unusual flag combos).
