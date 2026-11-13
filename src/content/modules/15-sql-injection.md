---
number: 15
title: SQL Injection
summary: Injecting SQL through untrusted input — in-band, blind/inferential, and out-of-band types, the detection methodology, evasion basics, and the parameterization that eliminates the class entirely.
icon: database
category: Application
readTime: 11
objectives:
  - Explain how SQL injection arises from unparameterized queries
  - Distinguish in-band, blind/inferential, and out-of-band SQLi
  - Walk the SQLi detection and testing methodology
  - Understand WAF-evasion basics and their limits
  - Apply the definitive countermeasures (parameterized queries, least privilege)
tools:
  - { name: sqlmap, purpose: Automated SQLi detection, exploitation, and DB extraction, type: Open Source, source: "https://sqlmap.org/" }
  - { name: Burp Suite, purpose: Manual SQLi discovery and verification, type: Commercial, source: "https://portswigger.net/burp" }
  - { name: OWASP ZAP, purpose: Open-source scanning for injection flaws, type: Open Source, source: "https://www.zaproxy.org/" }
  - { name: NoSQLMap, purpose: Injection testing for NoSQL databases, type: Open Source, source: "https://github.com/codingo/NoSQLMap" }
  - { name: ghauri, purpose: Fast SQLi detection/exploitation tool, type: Open Source, source: "https://github.com/r0oth3x49/ghauri" }
  - { name: OWASP SQLi Prevention, purpose: Authoritative prevention cheat sheet, type: Online, source: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" }
takeaways:
  - SQLi happens when user input is concatenated into a query instead of being parameterized.
  - Blind SQLi extracts data via boolean/time responses even with no visible output.
  - WAFs reduce but don't eliminate risk — the real fix is in the code.
  - Parameterized queries + least-privilege DB accounts + input validation remove the class.
---

## Overview

**SQL injection (SQLi)** occurs when untrusted input is placed directly into a database
query, letting an attacker alter the query's logic. Impact ranges from authentication
bypass and data theft to full database — sometimes host — compromise. It's the archetypal
**injection** flaw and consistently among the highest-impact web risks.

## Why It Happens

Vulnerable code concatenates input into SQL:

```text
// vulnerable (conceptual)
query = "SELECT * FROM users WHERE name = '" + input + "'"
```

If `input` can contain SQL syntax, it changes the query's meaning. The fix is to send data
and code **separately** (parameterized queries), so input is always treated as data.

## Types of SQL Injection

- **In-band**
  - **Error-based** — the DB's error messages leak data/structure.
  - **UNION-based** — append a `UNION SELECT` to pull extra columns.
- **Blind / inferential** (no direct output)
  - **Boolean-based** — infer data from true/false page differences.
  - **Time-based** — infer data from deliberate response delays.
- **Out-of-band** — exfiltrate via a side channel (e.g. DNS) when responses aren't observable.

## Methodology

1. **Find input** that reaches a query (parameters, headers, cookies, JSON).
2. **Detect** — probe with a single quote / boolean / timing payloads and watch responses.
3. **Fingerprint** the DBMS (MySQL, MSSQL, PostgreSQL, Oracle) — syntax differs.
4. **Enumerate** databases, tables, columns (authorized).
5. **Extract / assess impact**, then document and remediate.

### Evasion (concept)

Attackers try comment insertion, case/whitespace tricks, and encoding to slip past naive
WAF signatures — which is exactly why signature-only defenses are insufficient and the code
fix is mandatory.

## Example Commands

```bash
# Manual detection: does a single quote break the query? does a delay confirm time-based?
#   name=foo'          -> error?
#   id=1 AND SLEEP(5)  -> response delayed?

# Automated detection/exploitation of YOUR OWN authorized target
sqlmap -u "https://example.com/item?id=1" --batch --dbs
sqlmap -u "https://example.com/item?id=1" --batch -D appdb --tables

# From an intercepted request file (keeps headers/cookies)
sqlmap -r request.txt --batch --level 3 --risk 2
```

## Countermeasures

- **Parameterized queries / prepared statements** (or safe ORMs) — the definitive fix; never concatenate input.
- **Input validation** — allow-list types/formats; reject unexpected characters where feasible.
- **Least privilege** — the app's DB account should have only the rights it needs (no DBA, no `FILE`).
- **Defense in depth** — stored-procedure discipline, escaping as a backup, a tuned **WAF**, generic error messages, and query/DB monitoring.
