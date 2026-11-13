---
number: 10
title: Denial-of-Service
summary: Overwhelming availability — volumetric, protocol, and application-layer DoS/DDoS attack categories, botnets and amplification, plus detection and modern mitigation.
icon: slash
category: System & Network
readTime: 9
objectives:
  - Distinguish DoS from DDoS and name the three attack categories
  - Explain botnets, reflection, and amplification
  - Recognize common attack vectors (SYN flood, UDP/ICMP flood, HTTP flood, Slowloris)
  - Apply detection and mitigation (rate-limiting, scrubbing, CDNs)
tools:
  - { name: hping3, purpose: Packet crafting for flood/testing (authorized lab), type: Open Source, source: "https://github.com/antirez/hping" }
  - { name: LOIC / HOIC, purpose: Historically notable flooding tools (study/awareness), type: Open Source, source: "https://sourceforge.net/projects/loic/" }
  - { name: Slowloris, purpose: Low-bandwidth application-layer DoS demonstration, type: Open Source, source: "https://github.com/gkbrk/slowloris" }
  - { name: Cloudflare, purpose: CDN with DDoS protection and traffic scrubbing, type: Commercial, source: "https://www.cloudflare.com/ddos/" }
  - { name: AWS Shield, purpose: Managed DDoS protection for AWS workloads, type: Commercial, source: "https://aws.amazon.com/shield/" }
  - { name: fail2ban, purpose: Ban abusive source IPs based on log patterns, type: Open Source, source: "https://github.com/fail2ban/fail2ban" }
  - { name: mod_evasive, purpose: Apache module for rate-based DoS mitigation, type: Open Source, source: "https://github.com/jzdziarski/mod_evasive" }
takeaways:
  - DoS targets the "A" in CIA — availability — rather than data confidentiality or integrity.
  - DDoS uses many distributed sources (botnets) and is far harder to block than single-source DoS.
  - Amplification/reflection (DNS, NTP, memcached) turns small requests into massive floods.
  - "Mitigation is layered: upstream scrubbing + CDN + rate-limiting + capacity + an incident runbook."
---

## Overview

A **Denial-of-Service (DoS)** attack makes a system or service unavailable to legitimate
users. A **Distributed DoS (DDoS)** does the same from many sources at once — typically a
**botnet** of compromised devices — making it far harder to filter by source.

Studying DoS is about resilience: understanding the vectors tells you where to add capacity,
filtering, and upstream protection. (This module is for defense and authorized testing of
your own infrastructure only.)

## Attack Categories

| Category | Target | Examples |
| --- | --- | --- |
| **Volumetric** | Bandwidth | UDP flood, ICMP flood, amplification (DNS/NTP/memcached) |
| **Protocol** | Connection state / tables | SYN flood, ACK flood, Smurf, Ping of Death, fragmentation |
| **Application-layer (L7)** | Server resources | HTTP GET/POST flood, Slowloris, slow-read |

### Botnets, reflection & amplification

- **Botnet** — large network of compromised hosts/IoT devices under C2 control.
- **Reflection** — spoof the victim's IP so responses from third parties hit the victim.
- **Amplification** — pick protocols where a small query yields a large response (DNS ANY, NTP monlist, memcached) to multiply volume.

### Notable vectors

- **SYN flood** — exhausts the half-open connection table.
- **Slowloris** — holds many connections open with partial requests, cheap for the attacker.
- **HTTP flood** — floods expensive application endpoints with seemingly legit requests.

## Detection

Sudden traffic spikes, skewed source-IP distributions, abnormal protocol ratios, rising
half-open connections, and latency/error surges. NetFlow/sFlow analytics and baselining
distinguish an attack from an organic traffic surge.

## Example (authorized testing against your own lab host)

```bash
# SYN flood test (lab only, against a host you own)
sudo hping3 -S --flood -p 80 10.0.0.5

# Application-layer slow attack demonstration
slowloris 10.0.0.5 -p 80

# Defensive: jail abusive IPs seen in web logs
sudo fail2ban-client status
```

## Countermeasures

- **Upstream/edge:** CDN + DDoS scrubbing (Cloudflare, AWS Shield, Akamai) to absorb volumetrics before they reach you.
- **Network:** rate-limiting, SYN cookies, BCP38 anti-spoofing, blackhole/sinkhole routing, anycast.
- **Application:** caching, autoscaling, connection/request limits (mod_evasive, WAF rules), CAPTCHA on abuse.
- **Process:** capacity headroom, an up-to-date **DDoS runbook**, and provider contacts rehearsed in advance.
