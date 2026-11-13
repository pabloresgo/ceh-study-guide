---
number: 2
title: Footprinting and Reconnaissance
summary: Gathering information about a target before touching it — passive OSINT, WHOIS and DNS footprinting, search-engine and social-media intelligence, and the email/website recon that builds the attacker's map.
icon: search
category: Reconnaissance
readTime: 11
objectives:
  - Distinguish passive vs. active footprinting and why passive comes first
  - Collect intelligence from WHOIS, DNS, search engines, and social media
  - Enumerate an organization's domains, subdomains, and public infrastructure
  - Perform email and website footprinting
  - Apply footprinting countermeasures to shrink your own attack surface
tools:
  - { name: Nmap, purpose: Network discovery; DNS and host reconnaissance via NSE scripts, type: Open Source, source: "https://nmap.org/" }
  - { name: theHarvester, purpose: Gather emails, subdomains, hosts, and names from public sources, type: Open Source, source: "https://github.com/laramies/theHarvester" }
  - { name: Recon-ng, purpose: Modular web reconnaissance framework, type: Framework, source: "https://github.com/lanmaster53/recon-ng" }
  - { name: Maltego, purpose: Link-analysis and OSINT graphing of relationships, type: Commercial, source: "https://www.maltego.com/" }
  - { name: Shodan, purpose: Search engine for internet-exposed devices and services, type: Online, source: "https://www.shodan.io/" }
  - { name: Censys, purpose: Internet asset and certificate search, type: Online, source: "https://censys.io/" }
  - { name: WHOIS / whois, purpose: Domain registration and ownership lookup, type: Built-in, source: "https://www.whois.com/" }
  - { name: dnsrecon, purpose: DNS enumeration and zone-transfer testing, type: Open Source, source: "https://github.com/darkoperator/dnsrecon" }
  - { name: Sublist3r, purpose: Fast subdomain enumeration via search engines, type: Open Source, source: "https://github.com/aboul3la/Sublist3r" }
  - { name: FOCA, purpose: Metadata extraction from public documents, type: Open Source, source: "https://github.com/ElevenPaths/FOCA" }
  - { name: OSINT Framework, purpose: Curated directory of OSINT sources and tools, type: Online, source: "https://osintframework.com/" }
takeaways:
  - Reconnaissance is the longest and most valuable phase — the quality of everything after depends on it.
  - Passive footprinting leaves no trace on the target; prefer it until active scanning is authorized.
  - Public metadata, DNS records, and social media leak far more than organizations realize.
  - You can defend by minimizing public data, hardening DNS, and scrubbing document metadata.
---

## Overview

**Footprinting** is the first phase of an engagement: building a profile of the target's
systems, people, and public presence *without* (yet) sending intrusive traffic. Good recon
turns a blind test into a guided one — you learn the domains, IP ranges, technologies,
employees, and exposures that tell you where to look next.

It splits into **passive** footprinting (only public sources — WHOIS, DNS, search engines,
social media; no packets to the target) and **active** footprinting (direct queries that
may be logged — DNS zone transfers, banner grabbing, social engineering).

## Key Concepts

### Sources of intelligence

- **Search engines & Google dorking** — advanced operators (`site:`, `filetype:`, `inurl:`, `intitle:`) surface exposed files and pages.
- **WHOIS** — registrant, registrar, name servers, and dates for a domain.
- **DNS footprinting** — A, AAAA, MX, NS, TXT, SOA, CNAME records reveal mail, hosting, and SPF/DKIM posture.
- **Website footprinting** — technologies, directories, headers, and archived versions (Wayback Machine).
- **Email footprinting** — tracking headers and pixels reveal routing and sometimes location.
- **Social media & people** — org charts, job postings (which leak the tech stack), and employee details feed later phishing.
- **Shodan/Censys** — internet-wide scans index exposed services so you don't have to touch the target to see them.

### Competitive intelligence & dark web

Public filings, press releases, and leaked-credential dumps round out the picture of an
organization's footprint.

## Methodology

1. Define scope and seed domains.
2. Passive collection: WHOIS, DNS, certificate transparency, search engines, social media.
3. Subdomain and infrastructure enumeration.
4. Document/metadata harvesting.
5. Consolidate into a target map (domains → IPs → services → people) for the scanning phase.

## Example Commands

```bash
# WHOIS registration data
whois example.com

# DNS records (answers, mail servers, name servers, everything)
dig example.com ANY +noall +answer
dig MX example.com +short
host -t ns example.com

# Attempt a zone transfer against each name server (often disabled — that's the point)
dig AXFR example.com @ns1.example.com

# Subdomain + host/email harvesting from public sources
theHarvester -d example.com -b bing,duckduckgo,crtsh
sublist3r -d example.com

# Certificate Transparency logs are a rich, passive subdomain source
curl -s "https://crt.sh/?q=%25.example.com&output=json" | jq -r '.[].name_value' | sort -u

# Passive service exposure via Shodan CLI (needs an API key)
shodan host 93.184.216.34
```

## Countermeasures

- Publish the **minimum** necessary WHOIS/DNS data; use registrar privacy where appropriate.
- Disable DNS **zone transfers** to untrusted hosts; split internal/external DNS.
- Strip **metadata** from documents before publishing; review what job ads reveal.
- Educate employees on oversharing; monitor for leaked credentials and typosquatted domains.
- Monitor Certificate Transparency and Shodan/Censys for your own exposed assets.
