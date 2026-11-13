---
number: 1
title: Introduction to Ethical Hacking
summary: The foundations — information security concepts, attack classifications, the hacking phases, and the frameworks (Cyber Kill Chain, MITRE ATT&CK) that structure how attacks and defenses are reasoned about.
icon: shield
category: Foundations
readTime: 9
objectives:
  - Define information security through the CIA triad and its extensions
  - Classify attackers, attack vectors, and attack types
  - Walk the five phases of a hacking engagement
  - Map adversary behavior with the Cyber Kill Chain and MITRE ATT&CK
  - Understand ethical hacking scope, legality, and the rules of engagement
tools:
  - { name: MITRE ATT&CK, purpose: Knowledge base of adversary tactics and techniques (TTPs), type: Online, source: "https://attack.mitre.org/" }
  - { name: Lockheed Martin Cyber Kill Chain, purpose: Seven-stage intrusion model for intelligence-driven defense, type: Online, source: "https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html" }
  - { name: MITRE D3FEND, purpose: Knowledge graph of defensive countermeasures mapped to ATT&CK, type: Online, source: "https://d3fend.mitre.org/" }
  - { name: NIST Cybersecurity Framework, purpose: Identify/Protect/Detect/Respond/Recover risk framework, type: Online, source: "https://www.nist.gov/cyberframework" }
  - { name: OWASP, purpose: Open community and standards for application security, type: Online, source: "https://owasp.org/" }
takeaways:
  - Security is a balance of confidentiality, integrity, and availability against functionality and usability.
  - Ethical hacking is authorized, scoped, and documented — intent and permission are what separate it from a crime.
  - The five phases (recon → scanning → gaining access → maintaining access → clearing tracks) recur throughout the whole curriculum.
  - Frameworks like the Cyber Kill Chain and ATT&CK turn ad-hoc attacks into a shared vocabulary for defenders.
---

## Overview

**Ethical hacking** is the authorized practice of using the same tools, techniques, and
mindset as a malicious attacker to find and fix security weaknesses *before* an adversary
exploits them. The deliverable is not a compromise — it's a report that makes the
organization more resilient.

What makes it *ethical* is entirely contextual: **explicit authorization**, a defined
**scope**, a **rules-of-engagement** agreement, and responsible handling of whatever you
find. Remove any of those and the identical keystrokes become a crime.

## Key Concepts

### The CIA triad

All of information security reduces to protecting three properties:

- **Confidentiality** — only authorized parties can read the data (encryption, access control).
- **Integrity** — data is accurate and unaltered (hashing, digital signatures).
- **Availability** — systems and data are reachable when needed (redundancy, DDoS protection).

Often extended with **Authenticity** and **Non-repudiation**. Security always trades off
against **functionality** and **usability** — the "security triangle."

### Classifying attackers

Black-hat (malicious), white-hat (authorized/ethical), and grey-hat (in between) are the
classic labels, alongside script kiddies, hacktivists, state-sponsored actors, insiders,
and organized crime. Motivation and authorization matter more than skill.

### Attack vectors and types

- **Vectors:** the path in — cloud misconfig, supply chain, phishing, exposed services, mobile, insider.
- **Types:** passive vs. active; and by target layer — OS attacks, misconfiguration attacks, application-level attacks, and shrink-wrap/default-install attacks.

### The five phases of hacking

1. **Reconnaissance** — passively and actively gather information (Modules 2–4).
2. **Scanning** — map live hosts, ports, services, and vulnerabilities (Modules 3, 5).
3. **Gaining access** — exploit a weakness to get a foothold (Module 6+).
4. **Maintaining access** — persist and escalate (Module 6).
5. **Clearing tracks** — remove evidence to avoid detection (Module 6).

### Adversary frameworks

The **Cyber Kill Chain** (Lockheed Martin) models an intrusion as seven stages:
reconnaissance → weaponization → delivery → exploitation → installation →
command & control (C2) → actions on objectives. Breaking any single link disrupts the attack.

**MITRE ATT&CK** (pronounced "attack") is a living matrix of real-world adversary
**tactics** (the *why* — e.g. Persistence, Privilege Escalation) and **techniques** (the
*how*). It's the common language defenders use to describe, detect, and test against
attacker behavior; **MITRE D3FEND** maps countermeasures back onto it.

## Scope, Legality & Ethics

A legitimate engagement is defined by paperwork before any packets fly:

- **Authorization / scope** — which assets, which IP ranges, which times, which techniques are in or out.
- **Rules of engagement (RoE)** — escalation contacts, handling of sensitive data, stop conditions.
- **Relevant law & standards** — e.g. the U.S. Computer Fraud and Abuse Act (CFAA), GDPR for personal data, PCI-DSS for cardholder environments, ISO/IEC 27001, and the NIST CSF.

## Example Commands

Module 1 is conceptual, but you'll set up a safe, *authorized* lab to practice the rest of
the curriculum. A minimal local lab:

```bash
# Confirm your attack box tooling is present (e.g. on Kali/Parrot)
nmap --version
msfconsole --version

# Spin up a deliberately vulnerable practice target you control (lab use only)
docker run --rm -it -p 80:80 vulnerables/web-dvwa

# Keep your tooling and signatures current before each engagement
sudo apt update && sudo apt full-upgrade -y
```

## Key Takeaways

See the highlighted list — the five phases and the two core frameworks (Kill Chain and
ATT&CK) are the scaffolding every later module hangs off.
