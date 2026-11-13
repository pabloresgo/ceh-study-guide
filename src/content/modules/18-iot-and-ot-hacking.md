---
number: 18
title: IoT and OT Hacking
summary: Securing connected and industrial systems — IoT architecture and the OWASP IoT Top 10, OT/ICS (SCADA, PLCs, Modbus), their attack surfaces, and the defenses for environments where availability and safety come first.
icon: chip
category: Infrastructure
readTime: 11
objectives:
  - Understand IoT architecture, protocols, and the OWASP IoT Top 10
  - Learn OT/ICS components (SCADA, PLC, HMI) and protocols
  - Recognize IoT/OT attack surfaces and threats
  - Apply countermeasures suited to safety-critical, availability-first environments
tools:
  - { name: Shodan, purpose: Discover internet-exposed IoT/OT devices, type: Online, source: "https://www.shodan.io/" }
  - { name: Nmap (+ICS NSE), purpose: Device discovery and ICS protocol probing, type: Open Source, source: "https://nmap.org/" }
  - { name: Wireshark, purpose: Analyze IoT/ICS protocol traffic (MQTT, Modbus, etc.), type: Open Source, source: "https://www.wireshark.org/" }
  - { name: Firmware Analysis Toolkit / binwalk, purpose: Extract and analyze device firmware, type: Open Source, source: "https://github.com/ReFirmLabs/binwalk" }
  - { name: MQTT tools (mosquitto), purpose: Test MQTT brokers and messaging, type: Open Source, source: "https://mosquitto.org/" }
  - { name: PLCScan / modbus tools, purpose: Enumerate industrial controllers (lab/authorized), type: Open Source, source: "https://github.com/meeDamian/plcscan" }
  - { name: OWASP IoT Top 10, purpose: Canonical IoT risk categories, type: Online, source: "https://owasp.org/www-project-internet-of-things/" }
takeaways:
  - IoT devices ship with weak defaults, poor update paths, and large, long-lived populations.
  - OT/ICS prioritizes availability and safety — many protocols have no authentication by design.
  - Never run intrusive scans against live OT without explicit approval; it can cause physical harm.
  - Defend with segmentation, default-credential elimination, patching/firmware control, and monitoring.
---

## Overview

**IoT** (consumer/enterprise connected devices) and **OT** (operational technology running
physical processes) extend security into the physical world. Both are notorious for weak
authentication, infrequent updates, and protocols designed for reliability rather than
security. In OT, a careless test can stop a turbine or a production line — **safety first**.

## IoT

- **Architecture:** devices/sensors → gateways → cloud/backend → mobile/web apps, over protocols like MQTT, CoAP, Zigbee, BLE, and Z-Wave.
- **OWASP IoT Top 10 themes:** weak/default passwords, insecure network services, insecure ecosystem interfaces, lack of secure update, insecure data storage/transfer, poor device management, and insecure defaults.
- **Attack surface:** default credentials, exposed services, unsigned firmware, cleartext protocols, and the mobile/cloud apps that control devices (which tie back to Modules 14 and 17).

## OT / ICS

- **Components:** **SCADA** (supervisory control), **PLCs** (controllers), **HMIs** (operator interfaces), RTUs, and historians.
- **Protocols:** Modbus, DNP3, EtherNet/IP, PROFINET, S7 — often **no authentication or encryption** by design.
- **Models:** the **Purdue model** layers OT networks; the goal is to keep IT and OT separated.
- **Threats:** exposed controllers (findable on Shodan), legacy unpatched systems, flat networks bridging IT and OT, and malware tailored to ICS.

## Methodology (authorized, careful)

1. **Passive discovery first** — Shodan/Censys and passive traffic capture; avoid active probing of live OT.
2. **Map devices/protocols** in a lab or an approved maintenance window only.
3. **Assess** firmware, default creds, exposed services, and segmentation.
4. **Report** with availability/safety impact front and center.

## Example Commands

```bash
# Passive exposure discovery (no packets to the target device)
shodan search "port:502 Modbus"          # exposed Modbus controllers
shodan search "MQTT"

# Lab firmware triage
binwalk -e firmware.bin
strings -n 8 firmware.bin | grep -iE 'password|key|http'

# ICS protocol identification in a captured pcap (read-only)
tshark -r plant.pcap -Y "modbus" -T fields -e modbus.func_code
```

> Do not actively scan or fuzz production OT/ICS. Intrusive traffic can disrupt physical
> processes. Test in labs or approved, supervised windows only.

## Countermeasures

- **Segment** IT from OT (Purdue zones, firewalls/data diodes); no OT device directly on the internet.
- **Eliminate default credentials**; enforce strong auth and, where supported, encrypted protocols/gateways.
- **Control firmware/patching** with signed updates and vendor-coordinated maintenance.
- **Monitor** with OT-aware IDS (passive), asset inventory, and anomaly detection; rehearse incident response that accounts for safety.
