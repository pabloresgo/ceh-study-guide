# CEH Study Guide

A personal, study-oriented reference covering the **20 Certified Ethical Hacker (CEH)
modules** — core concepts, the tools that matter, representative example commands, and the
**defensive countermeasures** for each topic. Built as a clean, searchable website for
authorized learning, labs, and exam prep.

> **Ethics & authorization first.** This material is for individual study and for testing
> systems you own or have explicit written permission to assess. Understanding attacker
> techniques is a means to *defend* against them.

## What's inside

- **20 module pages**, each structured the same way: Overview → Key Concepts → Methodology →
  Example Commands → Countermeasures → Key Takeaways.
- A **filterable tool reference** per module (name / purpose / type / official source).
- **Copy-to-clipboard** command blocks.
- **Instant search** across every module (press <kbd>/</kbd>).
- **Light / dark** theme, mobile-friendly, fully static (fast + private).

### Modules

1. Introduction to Ethical Hacking · 2. Footprinting & Reconnaissance · 3. Scanning Networks ·
4. Enumeration · 5. Vulnerability Analysis · 6. System Hacking · 7. Malware Threats ·
8. Sniffing · 9. Social Engineering · 10. Denial-of-Service · 11. Session Hijacking ·
12. Evading IDS, Firewalls & Honeypots · 13. Hacking Web Servers · 14. Hacking Web
Applications · 15. SQL Injection · 16. Hacking Wireless Networks · 17. Hacking Mobile
Platforms · 18. IoT & OT Hacking · 19. Cloud Computing · 20. Cryptography

## Tech stack

- [Astro](https://astro.build/) static-site generator (content as Markdown)
- Zero runtime framework — plain CSS design tokens + a little vanilla JS for search, theme,
  copy buttons, and filtering
- Deploys to **GitHub Pages**

## Run it anywhere

```bash
git clone https://github.com/pabloresgo/ceh-study-guide.git
cd ceh-study-guide
npm install
npm run dev        # http://localhost:4321/ceh-study-guide
```

Build a production copy:

```bash
npm run build      # outputs static site to ./dist
npm run preview    # serve the built site locally
```

## Adding or editing content

Each module is a single Markdown file in `src/content/modules/`. The **frontmatter** holds
structured data (objectives, the tool table, takeaways) and the **body** holds the narrative
sections. Add a new module by dropping in a file that matches the schema in
`src/content/config.ts` — it appears on the home grid and in search automatically.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes it to GitHub Pages at:

```
https://pabloresgo.github.io/ceh-study-guide/
```

Renaming the repo? Update `BASE` in `astro.config.mjs` (and the workflow) to match.

---

*For individual study and authorized security testing only.*
