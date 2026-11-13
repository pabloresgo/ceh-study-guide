---
number: 8
title: Sniffing
summary: Capturing and analyzing network traffic — passive vs. active sniffing, MAC flooding, ARP and DHCP attacks, DNS poisoning, and the switch/network hardening that stops them.
icon: wave
category: System & Network
readTime: 11
objectives:
  - Distinguish passive vs. active sniffing and where each works
  - Explain MAC flooding, ARP spoofing, DHCP starvation, and DNS poisoning
  - Capture and filter traffic to extract useful data
  - Defend switched networks against sniffing attacks
tools:
  - { name: Wireshark, purpose: Deep packet capture and protocol analysis, type: Open Source, source: "https://www.wireshark.org/" }
  - { name: tcpdump, purpose: Command-line packet capture and filtering, type: Built-in, source: "https://www.tcpdump.org/" }
  - { name: Ettercap, purpose: MITM framework for ARP poisoning and sniffing, type: Open Source, source: "https://www.ettercap-project.org/" }
  - { name: Bettercap, purpose: Modern MITM/network-attack framework, type: Open Source, source: "https://www.bettercap.org/" }
  - { name: dsniff, purpose: Classic suite for sniffing credentials on a LAN, type: Open Source, source: "https://www.monkey.org/~dugsong/dsniff/" }
  - { name: macof (dsniff), purpose: MAC-flooding a switch's CAM table, type: Open Source, source: "https://www.monkey.org/~dugsong/dsniff/" }
  - { name: tshark, purpose: Wireshark's CLI for scripted captures, type: Open Source, source: "https://www.wireshark.org/docs/man-pages/tshark.html" }
takeaways:
  - Hubs broadcast to everyone; switches don't — so attackers force switches to leak (MAC flooding) or redirect (ARP spoofing).
  - ARP has no authentication, which is why ARP spoofing underlies most LAN MITM.
  - Encryption (TLS, SSH, VPN) makes captured traffic useless to the sniffer.
  - Port security, DHCP snooping, and Dynamic ARP Inspection are the switch-level defenses.
---

## Overview

**Sniffing** is capturing traffic as it crosses a network. On a shared medium the attacker
just listens (**passive**); on a switched network they must actively manipulate forwarding
(**active**) to see traffic not destined for them. Sniffing yields credentials, tokens,
emails, and configuration — unless the traffic is encrypted.

## Key Concepts

### Passive vs. active

- **Passive** — put the NIC in promiscuous/monitor mode and capture (works on hubs, mirror ports, or wireless).
- **Active** — on switches, redirect traffic to yourself via one of the attacks below.

### Layer-2 attacks

- **MAC flooding** — overwhelm the switch's CAM table so it "fails open" and floods frames like a hub.
- **ARP spoofing/poisoning** — forge ARP replies so victims send their traffic through you (MITM). ARP has no authentication.
- **MAC spoofing** — impersonate another host's MAC.
- **DHCP starvation + rogue DHCP** — exhaust the pool, then hand out malicious gateway/DNS settings.
- **STP manipulation** — become the root bridge to reroute traffic.

### DNS poisoning

Forge DNS responses (local resolver cache, or intranet spoofing) to send victims to
attacker-controlled hosts.

## Methodology

1. Position on the LAN (physical port, rogue AP, or compromised host).
2. Gain visibility (passive capture, or active redirection via ARP/MAC).
3. Capture and filter for high-value protocols (HTTP, FTP, SMTP, Telnet, DNS).
4. Extract credentials/tokens — then recommend encryption and L2 hardening.

## Example Commands

```bash
# Passive capture to a file, then analyze
sudo tcpdump -i eth0 -w capture.pcap
sudo tcpdump -i eth0 'tcp port 80 or tcp port 21'   # HTTP/FTP only

# Pull readable strings/credentials fields from a capture (CLI)
tshark -r capture.pcap -Y "http.request" -T fields -e http.host -e http.request.uri

# Wireshark display filters (GUI)
#   http.authbasic        -> HTTP Basic creds
#   ftp.request.command   -> FTP USER/PASS
#   dns                   -> DNS queries/responses

# Enable forwarding before any authorized MITM lab, then use Ettercap/Bettercap
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
sudo bettercap -iface eth0   # then use net.probe / arp.spoof modules in-lab
```

## Countermeasures

- **Encrypt everything** — TLS/HTTPS, SSH, SMTPS/IMAPS, VPNs — so captures are worthless.
- Switch hardening: **port security** (limit MACs), **DHCP snooping**, **Dynamic ARP Inspection (DAI)**, and BPDU guard.
- Use static ARP for critical hosts; segment with VLANs; 802.1X for port authentication.
- Monitor for CAM-table overflows, ARP anomalies, and rogue DHCP servers.
