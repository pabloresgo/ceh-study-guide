---
number: 6
title: System Hacking
summary: The core attack lifecycle on a host — gaining access (password attacks, exploitation), escalating privileges, maintaining access (persistence), and clearing logs — with the defenses that break each stage.
icon: terminal
category: System & Network
readTime: 16
objectives:
  - Walk the system-hacking methodology end to end
  - Understand password-cracking categories and authentication internals
  - Explain privilege-escalation techniques and defenses
  - Describe persistence and anti-forensic ("clearing tracks") concepts
  - Apply layered countermeasures at each stage
tools:
  - { name: Metasploit Framework, purpose: Exploitation, payloads, and post-exploitation modules, type: Framework, source: "https://www.metasploit.com/" }
  - { name: John the Ripper, purpose: Offline password hash cracking, type: Open Source, source: "https://www.openwall.com/john/" }
  - { name: Hashcat, purpose: GPU-accelerated hash cracking, type: Open Source, source: "https://hashcat.net/hashcat/" }
  - { name: Hydra, purpose: Online/network credential testing across many protocols, type: Open Source, source: "https://github.com/vanhauser-thc/thc-hydra" }
  - { name: Mimikatz, purpose: Windows credential extraction (research/defense testing), type: Open Source, source: "https://github.com/gentilkiwi/mimikatz" }
  - { name: BloodHound, purpose: Active Directory attack-path and privilege analysis, type: Open Source, source: "https://github.com/BloodHoundAD/BloodHound" }
  - { name: PowerView / PowerSploit, purpose: AD situational awareness (PowerShell), type: Open Source, source: "https://github.com/PowerShellMafia/PowerSploit" }
  - { name: LinPEAS / WinPEAS, purpose: Local privilege-escalation enumeration, type: Open Source, source: "https://github.com/carlospolop/PEASS-ng" }
  - { name: Responder, purpose: LLMNR/NBT-NS poisoning and credential capture (lab/defense), type: Open Source, source: "https://github.com/lgandx/Responder" }
takeaways:
  - System hacking is a four-stage loop; defenders only need to break one stage to disrupt the attack.
  - Most "hacking" is really credential abuse — strong, unique, MFA-protected credentials remove the easiest path.
  - Privilege escalation exploits misconfiguration far more often than memory-corruption 0-days.
  - Persistence and log-clearing are why detection, centralized logging, and EDR matter.
---

## Overview

**System hacking** is where recon pays off: the attacker uses what they learned to gain a
foothold, elevate to higher privileges, keep that access across reboots, and finally remove
evidence. Studying it as a defender tells you exactly where to place controls.

The methodology has four stages, each mapping to MITRE ATT&CK tactics:

1. **Gaining access** — cracking or capturing credentials, or exploiting a vulnerability.
2. **Escalating privileges** — from user to admin/root/SYSTEM.
3. **Maintaining access** — persistence, remote execution, hiding artifacts.
4. **Clearing logs** — anti-forensics to evade detection.

## Stage 1 — Gaining Access

### Password attacks

Authentication usually verifies a **hash** of a password, so attackers target hashes:

- **Dictionary / wordlist** — try known/likely passwords.
- **Brute force** — try all combinations (slow; mitigated by length).
- **Rule/hybrid** — mutate wordlists (append years, substitute letters).
- **Rainbow tables** — precomputed hash→plaintext lookups; defeated by **salting**.
- **Online attacks** — guess against a live service (rate-limited, lockout-prone).
- **Credential stuffing / password spraying** — reuse leaked creds or try one common password across many accounts.
- **Capture & relay** — sniffing, LLMNR/NBT-NS poisoning, pass-the-hash.

**Salting** adds random per-user data before hashing so identical passwords produce
different hashes, breaking precomputation. Modern storage uses slow KDFs (bcrypt, scrypt,
Argon2, PBKDF2).

### Exploitation concepts

When credentials fail, attackers exploit software flaws. Key concepts to understand (for
defense): **buffer overflow** (writing past a buffer to hijack control flow), modern
mitigations (**ASLR**, **DEP/NX**, stack canaries) and why they raise the bar,
**return-oriented programming (ROP)** as a technique to work around non-executable memory,
and **exploit chaining** (combining several weaknesses). Frameworks like Metasploit
package tested exploits and payloads for authorized testing.

## Stage 2 — Escalating Privileges

- **Vertical** (user → admin) vs. **horizontal** (same level, another user).
- Common Windows paths: unquoted service paths, weak service/file permissions, token
  impersonation, UAC bypass, DLL hijacking, credential reuse.
- Common Linux paths: misconfigured **sudo**, **SUID** binaries, writable cron/PATH,
  kernel exploits, capabilities.
- Enumeration tools (LinPEAS/WinPEAS, BloodHound for AD) surface these automatically.

## Stage 3 — Maintaining Access

Persistence survives reboots and logouts: scheduled tasks/cron, services, registry
run-keys, startup folders, SSH keys, web shells, and backdoors. Attackers also **execute
applications** remotely and **hide files** (alternate data streams on NTFS, hidden
attributes, steganography) to stay quiet.

## Stage 4 — Clearing Logs

Anti-forensics: clearing Windows event logs, Linux auth/syslog, shell history; disabling
auditing; timestomping. This is precisely why logs must be shipped **off-host** in real time.

## Example Commands

```bash
# Identify a captured hash type, then crack offline with a wordlist
hashid '$1$abc...'
john --format=sha512crypt --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
hashcat -m 1800 hashes.txt /usr/share/wordlists/rockyou.txt   # sha512crypt

# Authorized online credential test against SSH (expect lockouts in real targets)
hydra -L users.txt -P passwords.txt ssh://192.168.1.10 -t 4

# Linux local privilege-escalation enumeration
./linpeas.sh | tee linpeas.txt
sudo -l            # what can this user run as root?
find / -perm -4000 -type f 2>/dev/null   # SUID binaries

# Metasploit, high level (authorized lab)
msfconsole -q
# use exploit/...  ; set RHOSTS ...; set PAYLOAD ...; run

# Active Directory attack-path mapping (collect then analyze in BloodHound)
bloodhound-python -u user -p pass -d example.com -c All
```

## Countermeasures

- **Credentials:** enforce length + MFA, ban reused/breached passwords, store with Argon2/bcrypt + salt, and monitor for spraying/stuffing.
- **Privilege:** least privilege, fix service/file permissions, patch kernels, restrict `sudo`/SUID, deploy LAPS, tier admin accounts.
- **Persistence & detection:** application allow-listing, EDR, monitor autoruns/scheduled tasks, and ship logs to a central, tamper-resistant SIEM.
- **Log integrity:** forward logs off-host in real time; alert on log-clearing and auditing-disabled events.
