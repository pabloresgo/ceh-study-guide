---
number: 11
title: Session Hijacking
summary: Taking over an authenticated session — application-level (token/cookie theft, fixation, XSS) and network-level (TCP hijacking, MITM) techniques, and the token-handling defenses that stop them.
icon: link
category: Application
readTime: 9
objectives:
  - Explain session hijacking and why it bypasses authentication
  - Distinguish application-level from network-level hijacking
  - Describe token theft, session fixation, and prediction
  - Apply secure session-management countermeasures
tools:
  - { name: Burp Suite, purpose: Intercepting proxy; session token analysis and replay, type: Commercial, source: "https://portswigger.net/burp" }
  - { name: OWASP ZAP, purpose: Open-source proxy/scanner with session analysis, type: Open Source, source: "https://www.zaproxy.org/" }
  - { name: Bettercap, purpose: Network MITM, HTTPS stripping, and session capture, type: Open Source, source: "https://www.bettercap.org/" }
  - { name: Wireshark, purpose: Capture tokens/cookies in unencrypted traffic, type: Open Source, source: "https://www.wireshark.org/" }
  - { name: Caido, purpose: Modern web-security testing proxy, type: Commercial, source: "https://caido.io/" }
  - { name: Hetty, purpose: Lightweight HTTP(S) proxy for session/API testing, type: Open Source, source: "https://github.com/dstotijn/hetty" }
takeaways:
  - If an attacker steals a valid session token, they don't need the password.
  - Application-level hijacking (XSS, fixation, sniffed cookies) is more common than TCP-level hijacking today.
  - HTTPS everywhere plus HttpOnly/Secure/SameSite cookies removes the easiest theft paths.
  - Regenerate session IDs on login and bind sessions to context; expire aggressively.
---

## Overview

**Session hijacking** takes over a user's already-authenticated session by capturing or
forging the identifier (cookie/token) that stands in for their login. Because the session is
already trusted, hijacking sidesteps passwords and even MFA performed at login time.

## Key Concepts

### Application-level hijacking

Attacks the session token itself:

- **Session sniffing** — capture the cookie over unencrypted HTTP.
- **Cross-site scripting (XSS)** — steal tokens via injected script (see Module 14).
- **Session fixation** — force a victim to use a known session ID, then ride it after they log in.
- **Session prediction** — exploit weak/sequential token generation.
- **Token replay / theft** — reuse a stolen bearer/JWT token.

### Network-level hijacking

Attacks the transport:

- **TCP session hijacking** — predict/guess sequence numbers to inject into an established TCP session.
- **MITM / man-in-the-browser** — intercept and alter traffic.
- **IP spoofing + desync, RST hijacking, blind hijacking** — classic transport techniques, largely mitigated by encryption and randomized sequence numbers.

## Methodology

1. Observe the session (how tokens are issued, transmitted, validated).
2. Capture or force a token (sniffing, XSS, fixation).
3. Replay the token to impersonate the user.
4. Recommend secure session handling.

## Example (authorized web test)

```text
# With Burp Suite / ZAP as an intercepting proxy:
1. Capture the Set-Cookie / Authorization header on login.
2. Inspect token entropy, flags (HttpOnly, Secure, SameSite), and lifetime.
3. Replay the token in a fresh client to test whether the server
   ties the session to anything (IP, user agent, re-auth).
4. Test fixation: set a known SID pre-login and see if it survives authentication.
```

```text
# Wireshark display filters to spot cleartext tokens
http.cookie            # cookies sent in the clear
http.set_cookie        # tokens issued over HTTP instead of HTTPS
```

## Countermeasures

- **Transport:** HTTPS/HSTS everywhere — never transmit tokens over HTTP.
- **Cookies:** set **HttpOnly**, **Secure**, and **SameSite**; scope paths/domains tightly.
- **Tokens:** high-entropy, unpredictable IDs; **regenerate the session ID on login** and privilege change; short idle/absolute timeouts; server-side invalidation on logout.
- **Binding & monitoring:** optionally bind sessions to context (IP/UA) with care; require re-auth for sensitive actions; alert on concurrent/geo-impossible sessions.
- Fix the upstream causes — eliminate XSS (Module 14) and enforce encryption (Module 8).
