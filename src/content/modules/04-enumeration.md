---
number: 4
title: Enumeration
summary: Actively querying services to extract names, shares, and configuration — NetBIOS/SMB, SNMP, LDAP, NTP, SMTP, DNS, and more — to turn open ports into concrete usernames, hosts, and footholds.
icon: list
category: Reconnaissance
readTime: 12
objectives:
  - Define enumeration and the services/ports most worth enumerating
  - Enumerate NetBIOS/SMB, SNMP, LDAP, NTP, SMTP, NFS, and DNS
  - Extract usernames, shares, groups, and system data from each protocol
  - Apply enumeration countermeasures to each service
tools:
  - { name: enum4linux-ng, purpose: Consolidated SMB/NetBIOS/LDAP enumeration for Windows & Samba, type: Open Source, source: "https://github.com/cddmp/enum4linux-ng" }
  - { name: Nmap NSE scripts, purpose: Protocol-specific enumeration (smb-*, snmp-*, ldap-*, ntp-*), type: Open Source, source: "https://nmap.org/nsedoc/" }
  - { name: smbclient / smbmap, purpose: Browse and map SMB shares and permissions, type: Built-in, source: "https://www.samba.org/" }
  - { name: snmpwalk / snmp-check, purpose: Walk SNMP MIB trees to extract device data, type: Built-in, source: "http://www.net-snmp.org/" }
  - { name: ldapsearch, purpose: Query LDAP/Active Directory directory objects, type: Built-in, source: "https://www.openldap.org/" }
  - { name: rpcclient, purpose: Enumerate users/groups via MS-RPC, type: Built-in, source: "https://www.samba.org/" }
  - { name: NTP suite (ntpq, ntptrace), purpose: NTP mode-6/7 enumeration, type: Built-in, source: "http://www.ntp.org/" }
  - { name: OWASP Amass, purpose: In-depth DNS/subdomain enumeration and mapping, type: Open Source, source: "https://github.com/owasp-amass/amass" }
takeaways:
  - Enumeration is active — it creates connections and logs; it's the bridge from scanning to access.
  - SMB (139/445), SNMP (161), and LDAP (389/636) are the classic high-value enumeration targets.
  - Default/weak SNMP community strings ("public"/"private") leak entire device configurations.
  - Harden by disabling unused services, enforcing authentication, and restricting anonymous access.
---

## Overview

**Enumeration** establishes active connections to services discovered during scanning and
asks them directly for information: user accounts, group memberships, network shares,
running services, routing tables, device configuration, and more. Where footprinting is
passive and scanning finds *ports*, enumeration extracts the *content* behind those ports.

Because it's active, enumeration is logged — it already touches the territory of
unauthorized access if you lack permission.

## Services & Ports to Enumerate

| Service | Port(s) | What it yields |
| --- | --- | --- |
| NetBIOS | 137–139 | Names, sessions, shares |
| SMB | 445 | Shares, users, groups, policies |
| SNMP | 161/162 (UDP) | Device config, interfaces, ARP, users |
| LDAP | 389 / 636 | Directory users, groups, OUs (AD) |
| NTP | 123 (UDP) | Hosts, internal clients |
| SMTP | 25 | Valid users via VRFY/EXPN/RCPT |
| DNS | 53 | Records, zone data, subdomains |
| NFS | 2049 | Exported shares/mounts |
| RPC | 111 / 135 | Mapped endpoints and services |

## Methodology by Protocol

- **NetBIOS/SMB** — list shares and sessions, then users/groups. Null/anonymous sessions (where allowed) are a classic leak.
- **SNMP** — walking the MIB with a valid community string (often the default `public`) dumps interfaces, processes, routes, and even user accounts.
- **LDAP** — anonymous or authenticated binds enumerate the directory tree; invaluable against Active Directory.
- **NTP** — mode 6/7 queries reveal clients and peers, exposing internal hosts.
- **SMTP** — `VRFY`, `EXPN`, and `RCPT TO` responses confirm whether usernames exist.
- **DNS** — zone transfers and brute-forced records expand the host list.

## Example Commands

```bash
# SMB / NetBIOS — shares, users, groups, OS info
enum4linux-ng -A 192.168.1.10
smbclient -L //192.168.1.10 -N
smbmap -H 192.168.1.10

# Nmap NSE for SMB enumeration
nmap -p445 --script "smb-enum-shares,smb-enum-users,smb-os-discovery" 192.168.1.10

# SNMP — walk the full MIB with a community string
snmpwalk -v2c -c public 192.168.1.10
snmp-check 192.168.1.10 -c public

# LDAP / Active Directory
ldapsearch -x -H ldap://192.168.1.10 -b "dc=example,dc=com"

# SMTP user verification
nc -nv 192.168.1.10 25        # then: VRFY root  /  RCPT TO:<admin@example.com>

# NTP enumeration
ntpq -c readlist 192.168.1.10
```

## Countermeasures

- Disable **NetBIOS** and restrict **SMB** to authenticated, segmented access; block null sessions (`RestrictAnonymous`).
- Change default **SNMP community strings**, prefer **SNMPv3** with auth+privacy, or disable SNMP.
- Require authenticated **LDAP** binds; disable anonymous directory reads.
- Restrict **NTP** mode 6/7 queries and **DNS** zone transfers.
- Disable SMTP `VRFY`/`EXPN`; log and rate-limit enumeration-style traffic.
