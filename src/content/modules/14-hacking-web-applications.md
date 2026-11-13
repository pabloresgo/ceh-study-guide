---
number: 14
title: Hacking Web Applications
summary: The application layer — the OWASP Top 10, the web-app hacking methodology, injection/XSS/auth/access-control flaws, APIs and webhooks, and secure-development countermeasures.
icon: globe
category: Application
readTime: 14
objectives:
  - Understand web-application architecture and threat surface
  - Walk the web-app hacking methodology
  - Recognize OWASP Top 10 flaw classes (XSS, broken access control, SSRF, etc.)
  - Test APIs and webhooks
  - Apply secure-coding and defensive countermeasures
tools:
  - { name: Burp Suite, purpose: The standard web-app testing proxy/scanner, type: Commercial, source: "https://portswigger.net/burp" }
  - { name: OWASP ZAP, purpose: Open-source web-app scanner and proxy, type: Open Source, source: "https://www.zaproxy.org/" }
  - { name: ffuf, purpose: Fast fuzzing of paths, parameters, and values, type: Open Source, source: "https://github.com/ffuf/ffuf" }
  - { name: sqlmap, purpose: Automated SQL-injection detection and exploitation, type: Open Source, source: "https://sqlmap.org/" }
  - { name: Nuclei, purpose: Template-based vulnerability scanning for web apps/APIs, type: Open Source, source: "https://github.com/projectdiscovery/nuclei" }
  - { name: Postman, purpose: API request building and testing, type: Commercial, source: "https://www.postman.com/" }
  - { name: wpscan, purpose: WordPress-specific vulnerability scanner, type: Open Source, source: "https://wpscan.com/" }
  - { name: OWASP Top 10, purpose: Canonical list of top web-app risk categories, type: Online, source: "https://owasp.org/www-project-top-ten/" }
takeaways:
  - Web apps are the largest attack surface; the OWASP Top 10 is the canonical risk map.
  - Broken access control and injection consistently top real-world findings.
  - APIs expand the surface — test authz per object/function, not just authentication.
  - Validate input, encode output, parameterize queries, and enforce access control server-side.
---

## Overview

A **web application** runs logic on top of a web server and typically a database. It's the
richest attack surface in most organizations because it's internet-facing, custom-written,
and handles sensitive data. The **OWASP Top 10** organizes the dominant risk categories.

## OWASP Top 10 (2021) at a glance

1. **Broken Access Control** — users act outside intended permissions (IDOR, path abuse).
2. **Cryptographic Failures** — weak/missing encryption of data in transit/at rest.
3. **Injection** — SQL (Module 15), command, LDAP, and **Cross-Site Scripting (XSS)**.
4. **Insecure Design** — missing security controls by design.
5. **Security Misconfiguration** — defaults, verbose errors, open cloud buckets.
6. **Vulnerable & Outdated Components** — unpatched libraries/frameworks.
7. **Identification & Authentication Failures** — weak login, session issues.
8. **Software & Data Integrity Failures** — insecure deserialization, unverified updates.
9. **Security Logging & Monitoring Failures.**
10. **Server-Side Request Forgery (SSRF).**

## Methodology

1. **Map the app** — crawl/spider, enumerate endpoints, parameters, roles, and tech stack.
2. **Analyze entry points** — inputs, headers, cookies, file uploads, APIs.
3. **Test per class** — access control, injection, XSS, auth/session, SSRF, business logic.
4. **Confirm impact** (authorized) and document with remediation.

### Key flaw families

- **XSS** — reflected, stored, DOM — injects script that runs in victims' browsers (feeds Module 11 session hijacking).
- **Broken access control / IDOR** — changing an ID to access another user's object.
- **SSRF** — tricking the server into making requests to internal resources.
- **CSRF** — forcing a logged-in victim's browser to submit an action.
- **File upload / path** issues and **insecure deserialization.**

### APIs & webhooks

REST/GraphQL APIs need the same authz tests per object and per function (BOLA/BFLA), plus
rate-limiting and schema validation. Webhooks require signature verification and replay
protection.

## Example Commands

```bash
# Crawl + passive/active scan (authorized) via ZAP CLI
zap-cli quick-scan --self-contained https://example.com

# Fuzz a parameter for interesting responses
ffuf -u 'https://example.com/item?id=FUZZ' -w ids.txt -mc 200,302

# Template-based checks for known issues
nuclei -u https://example.com -t http/

# CMS-specific
wpscan --url https://example.com --enumerate vp
```

## Countermeasures

- **Input/output:** validate and canonicalize input server-side; **context-aware output encoding** to kill XSS; a strict **Content-Security-Policy**.
- **Access control:** enforce authorization on every request, server-side, per object and function; deny by default.
- **Data:** parameterized queries (Module 15), encryption in transit/at rest, secrets management.
- **Platform:** keep components patched, disable debug/verbose errors, add a **WAF**, and log + monitor security events.
- Adopt a secure SDLC: threat modeling, code review, SAST/DAST, and dependency scanning.
