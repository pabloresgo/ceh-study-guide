---
number: 13
title: Hacking Web Servers
summary: Attacking the server behind the site — web-server architecture and misconfigurations, the attack methodology, common flaws (directory traversal, misconfig, outdated software), and server hardening.
icon: server
category: Application
readTime: 10
objectives:
  - Understand web-server components and why they're targeted
  - Walk the web-server attack methodology
  - Recognize common server-side weaknesses and attacks
  - Apply web-server hardening and patch-management countermeasures
tools:
  - { name: Nikto, purpose: Web-server misconfiguration and known-vuln scanner, type: Open Source, source: "https://github.com/sullo/nikto" }
  - { name: Gobuster / ffuf, purpose: Directory, file, and vhost brute-forcing, type: Open Source, source: "https://github.com/ffuf/ffuf" }
  - { name: WhatWeb, purpose: Web technology and server fingerprinting, type: Open Source, source: "https://github.com/urbanadventurer/WhatWeb" }
  - { name: Nmap http-* NSE, purpose: HTTP enumeration (methods, titles, headers, known CVEs), type: Open Source, source: "https://nmap.org/nsedoc/categories/" }
  - { name: Burp Suite, purpose: Intercepting proxy and server-side testing, type: Commercial, source: "https://portswigger.net/burp" }
  - { name: Metasploit, purpose: Verified exploits for known web-server vulnerabilities, type: Framework, source: "https://www.metasploit.com/" }
takeaways:
  - Most web-server compromises stem from misconfiguration, default files, and unpatched software — not exotic 0-days.
  - Fingerprinting the server/version is step one; it maps directly to known CVEs.
  - Separate the web server (this module) from the web application (Module 14) — different layers, different fixes.
  - Hardening = patch, minimize, restrict, and monitor.
---

## Overview

A **web server** (Apache, Nginx, IIS, LiteSpeed) delivers content and hosts applications.
Attacking it targets the server software, its configuration, and the OS beneath — distinct
from attacking the *application* code (Module 14). The usual root causes are boring and
common: default installs, verbose errors, exposed admin panels, weak permissions, and
missing patches.

## Why Web Servers Get Compromised

Default configurations and sample files, unnecessary services/modules, directory listing
enabled, verbose banners, weak TLS, exposed management interfaces, and unpatched known
vulnerabilities.

## Attack Methodology

1. **Information gathering** — identify server, version, OS, and technologies.
2. **Footprinting the server** — headers, methods, error pages, robots.txt.
3. **Directory/content discovery** — find hidden paths, backups, admin panels.
4. **Vulnerability scanning** — map versions to known CVEs.
5. **Exploitation** — misconfig, traversal, or a known vuln (authorized).
6. **Document & remediate.**

### Common attacks

Directory traversal (`../`), HTTP method abuse (PUT/DELETE), misconfigured access controls,
exposed `.git`/backup files, web-server software CVEs, and web-cache/HTTP-request smuggling
at the server layer.

## Example Commands

```bash
# Fingerprint server/tech and HTTP methods
whatweb https://example.com
nmap -p80,443 --script "http-headers,http-methods,http-title,http-server-header" example.com

# Misconfiguration & known-vuln scan
nikto -h https://example.com

# Content/directory discovery
ffuf -u https://example.com/FUZZ -w /usr/share/wordlists/dirb/common.txt
gobuster dir -u https://example.com -w /usr/share/wordlists/dirb/common.txt

# Look for exposed source control / backups
curl -s https://example.com/.git/HEAD
```

## Countermeasures

- **Patch** the server and OS promptly; subscribe to vendor advisories.
- **Minimize**: remove default/sample files, unused modules, and directory listing; disable risky HTTP methods.
- **Restrict**: least-privilege file permissions, lock down admin interfaces (IP allow-list + MFA), strong TLS config.
- **Obscure & monitor**: suppress version banners and verbose errors; put a **WAF** in front; centralize and alert on access/error logs.
