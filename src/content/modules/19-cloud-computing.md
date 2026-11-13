---
number: 19
title: Cloud Computing
summary: Securing cloud and modern infrastructure — service/deployment models, the shared-responsibility model, container and serverless security, common cloud threats and misconfigurations, and cloud hardening.
icon: cloud
category: Infrastructure
readTime: 12
objectives:
  - Understand cloud service/deployment models and shared responsibility
  - Learn container (Docker/Kubernetes) and serverless security concepts
  - Recognize common cloud threats and misconfigurations
  - Apply cloud and container hardening countermeasures
tools:
  - { name: ScoutSuite, purpose: Multi-cloud security posture auditing, type: Open Source, source: "https://github.com/nccgroup/ScoutSuite" }
  - { name: Prowler, purpose: AWS/Azure/GCP security best-practice assessment, type: Open Source, source: "https://github.com/prowler-cloud/prowler" }
  - { name: Pacu, purpose: AWS exploitation framework for authorized testing, type: Framework, source: "https://github.com/RhinoSecurityLabs/pacu" }
  - { name: Trivy, purpose: Vulnerability + misconfig scanning for images/IaC, type: Open Source, source: "https://github.com/aquasecurity/trivy" }
  - { name: kube-bench / kube-hunter, purpose: Kubernetes CIS benchmarking and attack-surface testing, type: Open Source, source: "https://github.com/aquasecurity/kube-bench" }
  - { name: CloudSploit, purpose: Cloud configuration monitoring, type: Open Source, source: "https://github.com/aquasecurity/cloudsploit" }
  - { name: AWS IAM Access Analyzer, purpose: Native detection of over-broad access, type: Built-in, source: "https://aws.amazon.com/iam/features/analyze-access/" }
takeaways:
  - The shared-responsibility model splits duties — most breaches are the customer's misconfigurations, not provider flaws.
  - Public storage buckets, over-permissive IAM, and exposed metadata/keys are the classic cloud failures.
  - "Containers and serverless add new surfaces: images, orchestration, and function permissions."
  - Harden with least-privilege IAM, encryption, posture management (CSPM), and continuous monitoring.
---

## Overview

**Cloud computing** delivers compute, storage, and services on demand. Security changes
shape: you don't own the hardware, trust boundaries shift, and **configuration** becomes the
dominant risk. The headline cloud breaches are overwhelmingly **customer misconfigurations**
(public buckets, leaked keys, over-broad IAM) rather than provider compromises.

## Key Concepts

### Models

- **Service:** IaaS (you manage OS up), PaaS (platform managed), SaaS (app managed).
- **Deployment:** public, private, hybrid, multi-cloud.

### Shared Responsibility

The provider secures the cloud (hardware, hypervisor, managed services); **you** secure what
you put *in* it (data, identity, configuration, app code). The split moves up the stack from
IaaS → SaaS.

### Container & serverless

- **Containers (Docker)** — isolation via namespaces/cgroups; risks include vulnerable images, exposed daemons, privileged containers, and secrets in layers.
- **Orchestration (Kubernetes)** — large surface: API server exposure, RBAC gaps, pod security, network policies, and the metadata API.
- **Serverless (Lambda/Functions)** — no servers to patch, but over-permissioned function roles, event-data injection, and dependency risks move to the fore.

## Common Threats & Misconfigurations

- **Public/misconfigured storage** (S3/Blob/GCS) exposing data.
- **Over-permissive IAM** and long-lived access keys; privilege escalation via role chaining.
- **Exposed secrets** in code, images, or environment variables.
- **Instance metadata (IMDS) abuse** via SSRF to steal credentials.
- **Insecure APIs**, missing logging, and account hijacking.

## Methodology (authorized posture assessment)

1. **Inventory** accounts, regions, and assets.
2. **Audit configuration** against best practice (CSPM tools).
3. **Review IAM** for least privilege and unused credentials.
4. **Scan images/IaC** for vulns and misconfigs.
5. **Report** prioritized by exposure and blast radius.

## Example Commands

```bash
# Posture assessment of your own cloud account
prowler aws
scout aws

# Scan a container image and IaC for vulns + misconfigs
trivy image myorg/app:latest
trivy config ./terraform

# Kubernetes CIS benchmark + attack-surface check (your own cluster)
kube-bench run
kube-hunter --remote <cluster-endpoint>

# Spot-check for public S3 exposure (authorized)
aws s3api get-bucket-acl --bucket my-bucket
```

## Countermeasures

- **Identity:** least-privilege IAM, short-lived credentials/roles, MFA, and regular access reviews; prefer IMDSv2 to block SSRF credential theft.
- **Data:** encrypt at rest and in transit; private-by-default storage; centralized secrets management.
- **Workloads:** scan and sign images, run non-privileged containers, enforce K8s RBAC + network + pod-security policies.
- **Continuous:** CSPM + cloud-native logging (CloudTrail/Activity Logs) into a SIEM; guardrails/SCPs; infrastructure-as-code review.
