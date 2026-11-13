---
number: 9
title: Social Engineering
summary: Attacking the human layer — phishing and its variants, pretexting, impersonation, physical and insider threats — and the awareness, process, and technical controls that blunt them.
icon: people
category: System & Network
readTime: 10
objectives:
  - Explain why social engineering works (the psychological levers)
  - Classify human-, computer-, and mobile-based techniques
  - Recognize phishing variants (spear, whaling, vishing, smishing)
  - Understand insider threats and physical tailgating
  - "Build layered defenses: training, process, and technical controls"
tools:
  - { name: Gophish, purpose: Open-source phishing-simulation framework for awareness programs, type: Open Source, source: "https://getgophish.com/" }
  - { name: SET (Social-Engineer Toolkit), purpose: Framework for authorized social-engineering tests, type: Framework, source: "https://github.com/trustedsec/social-engineer-toolkit" }
  - { name: King Phisher, purpose: Phishing campaign simulation and metrics, type: Open Source, source: "https://github.com/rsmusllp/king-phisher" }
  - { name: Evilginx (research), purpose: Demonstrates MFA-phishing/session-token theft for defenders, type: Open Source, source: "https://github.com/kgretzky/evilginx2" }
  - { name: KnowBe4, purpose: Commercial security-awareness training and simulated phishing, type: Commercial, source: "https://www.knowbe4.com/" }
  - { name: OhPhish, purpose: EC-Council phishing-simulation platform, type: Commercial, source: "https://ohphish.eccouncil.org/" }
takeaways:
  - Social engineering bypasses technology by targeting trust, authority, urgency, and fear.
  - Phishing remains the #1 initial-access vector; spear phishing and BEC cause the biggest losses.
  - MFA helps but isn't immune — real-time phishing proxies can steal session tokens.
  - The strongest defense is a trained culture plus verification processes, backed by email/DNS controls.
---

## Overview

**Social engineering** manipulates people into breaking security — revealing credentials,
running attachments, wiring money, or granting physical access. It's effective because it
exploits human psychology rather than software, and no patch fixes trust.

## Why It Works

Attackers lean on **authority** (posing as IT/executives), **urgency/scarcity**, **fear**,
**social proof**, **reciprocity**, and **familiarity**. Pretexting wraps these in a
believable story.

## Techniques

### Human-based

Impersonation, pretexting, tailgating/piggybacking, shoulder surfing, dumpster diving,
"tech support" calls, and quid pro quo.

### Computer-based (phishing family)

- **Phishing** — mass deceptive emails/sites harvesting credentials or delivering malware.
- **Spear phishing** — tailored to a specific person/role.
- **Whaling** — targets executives.
- **BEC (Business Email Compromise)** — impersonates leadership to trigger fraudulent payments.
- **Pharming** — redirects victims via DNS/host tampering.
- **Watering hole** — compromises a site the target group frequents.

### Mobile-based

- **Vishing** (voice), **smishing** (SMS), malicious apps, and QR-code ("quishing") lures.

### Insider threats

Malicious, negligent, or compromised insiders — often the hardest to detect because the
access is legitimate.

## Methodology (authorized assessment)

1. Research targets (ties back to Module 2 footprinting).
2. Select a pretext and channel.
3. Build the lure (clone a login page, craft the email) — in a controlled simulation.
4. Launch and measure (click/submit rates), then debrief and train.

## Example (authorized phishing simulation)

```bash
# Gophish: run the server, then build campaigns in its admin UI
./gophish
# Workflow in the UI:
#   1) Sending profile (SMTP)   2) Landing page (clone)   3) Email template
#   4) Target group             5) Launch + track opens/clicks/submits
```

> Use these tools only for sanctioned awareness programs against your own users, with
> leadership sign-off and a debrief plan.

## Countermeasures

- **People:** continuous awareness training and realistic simulated phishing; a blame-free reporting culture ("report" button).
- **Process:** out-of-band verification for payments and credential/password resets; clear escalation paths; visitor/physical access controls against tailgating.
- **Technical:** MFA (prefer phishing-resistant FIDO2/passkeys), email authentication (**SPF, DKIM, DMARC**), link/attachment sandboxing, and web filtering.
- Monitor for look-alike domains and credential-harvesting pages impersonating your brand.
