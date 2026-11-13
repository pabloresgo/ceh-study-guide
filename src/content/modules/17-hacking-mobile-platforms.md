---
number: 17
title: Hacking Mobile Platforms
summary: Mobile attack surface — Android and iOS architecture, the OWASP Mobile Top 10, app and device threats, MDM, and mobile security guidelines for users and enterprises.
icon: phone
category: Infrastructure
readTime: 10
objectives:
  - Understand mobile attack vectors and the OWASP Mobile Top 10
  - Compare Android and iOS security models
  - Recognize app-, device-, and network-level mobile threats
  - Apply mobile device management and secure-use guidelines
tools:
  - { name: MobSF, purpose: Automated static + dynamic mobile app security analysis, type: Open Source, source: "https://github.com/MobSF/Mobile-Security-Framework-MobSF" }
  - { name: Frida, purpose: Dynamic instrumentation/hooking of mobile apps, type: Open Source, source: "https://frida.re/" }
  - { name: Objection, purpose: Runtime mobile exploration built on Frida, type: Open Source, source: "https://github.com/sensepost/objection" }
  - { name: apktool, purpose: Decompile/rebuild Android APK resources, type: Open Source, source: "https://github.com/iBotPeaches/Apktool" }
  - { name: jadx, purpose: Android dex-to-Java decompiler, type: Open Source, source: "https://github.com/skylot/jadx" }
  - { name: adb (Android Debug Bridge), purpose: Device/app inspection and control, type: Built-in, source: "https://developer.android.com/tools/adb" }
  - { name: OWASP MASVS/MASTG, purpose: Mobile security verification standard and testing guide, type: Online, source: "https://mas.owasp.org/" }
takeaways:
  - Mobile risk concentrates in insecure data storage, weak transport, and risky app permissions.
  - Android (open, sideloadable) and iOS (closed, curated) have different but overlapping risks.
  - Jailbreaking/rooting removes platform protections and widens exposure.
  - Defend with MDM, app vetting, encryption, least-privilege permissions, and user training.
---

## Overview

Mobile devices hold credentials, mail, MFA, and corporate data, crossing trust boundaries
constantly. The attack surface spans the **app**, the **device/OS**, the **network**, and the
**backend**. The **OWASP Mobile Top 10** frames the dominant app risks.

## Platform Models

- **Android** — Linux-based, app sandboxing, a granular permission model, but **sideloading** and fragmented patching widen risk. APKs are relatively easy to decompile.
- **iOS** — tightly controlled app store, strong sandbox and code-signing, Secure Enclave; smaller surface but not immune (jailbreaks, malicious profiles, supply-chain).

**Rooting/jailbreaking** disables platform protections, dramatically increasing exposure.

## Threats & Attack Vectors

- **Insecure data storage** — secrets/tokens in plaintext prefs, SQLite, logs.
- **Insecure communication** — missing TLS / no certificate pinning (MITM).
- **Weak authentication/session handling** and insecure deep links.
- **Reverse engineering & tampering** — repackaged/trojanized apps.
- **Excessive permissions** and risky third-party SDKs.
- **Device-level** — malicious apps, smishing (Module 9), rogue Wi-Fi/Bluetooth, lost/stolen devices.

## Methodology (authorized app assessment)

1. **Static analysis** — decompile; review storage, secrets, permissions, and endpoints.
2. **Dynamic analysis** — run the app, intercept traffic, hook functions (Frida/Objection).
3. **Network** — inspect API calls, test TLS/pinning and backend authz.
4. **Report** against MASVS controls.

## Example Commands

```bash
# Static + dynamic analysis in one place
# (MobSF: upload the APK/IPA to its web UI; or:)
apktool d app.apk -o app_src
jadx -d app_out app.apk

# Inspect an installed app via ADB (test device you own)
adb shell pm list packages | grep target
adb logcat | grep -i target

# Runtime inspection (e.g. detect/bypass checks in a device you control)
objection -g com.example.app explore
```

## Countermeasures

- **Enterprise:** MDM/UEM for policy, encryption, remote wipe, and app allow-listing; separate work/personal profiles.
- **App developers:** encrypt stored data, enforce TLS + **certificate pinning**, no hardcoded secrets, obfuscation + tamper/root detection, least-privilege permissions.
- **Users:** install only from official stores, review permissions, keep the OS patched, avoid rooting/jailbreaking, and use device encryption + screen lock + VPN on untrusted networks.
