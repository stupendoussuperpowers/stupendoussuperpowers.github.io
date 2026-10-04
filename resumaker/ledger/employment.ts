import type { Job } from "./types";

export const employment: Job[] = [
  {
    id: "ssl-ra",
    org: "New York University",
    where: "New York, NY",
    role: "Research Associate",
    team: "Secure Systems Lab",
    when: "2026-07 / 2026-08",
    bullets: [
      "Extended and enhanced in-toto and go-witness's build observability attestations for SBOMit [@scored26].",
    ],
    timeline: true,
  },
  {
    id: "commvault",
    org: "Commvault Systems",
    where: "Bangalore, India",
    role: "Engineer",
    team: "Virtual Server Agent Team",
    tech: "Python, .NET, VMware, Huawei Cloud",
    when: "2022-01 / 2024-08",
    bullets: [
      "Built data-protection software for VMware and Huawei private-cloud environments, deployed across 500+ enterprise and government organizations.",
      "Developed Commvault's VMware Cloud Director plugin, simplifying multi-step data-protection workflows for managed-service customers.",
      "Implemented agent-based Guest OS file recovery for VMware VMs, sending deduplicated data straight from source to storage and removing a bottleneck for workloads exceeding 10 GiB or 10,000 files.",
      "Extended Application-Aware Backup to VMware Cloud Director VMs, enabling granular backup and recovery of SQL Server and other applications.",
      "Refactored the Python SDK for VMware Cloud Director, improving end-to-end test reliability.",
    ],
    timeline: "Virtualization",
  },
  {
    id: "legalai",
    org: "LegalAI",
    where: "Remote",
    role: "Full-Stack & DevOps Intern",
    tech: "Node.js, React, Google Cloud Platform",
    when: "2021-04 / 2021-12",
    bullets: [
      "Designed and built a claims-processing platform of GCP-hosted microservices and React portals, handling legal-draft generation and review.",
      "Built the CI/CD pipeline around a custom App Engine-compatible local runtime, keeping local development in parity with GCP production.",
    ],
    timeline: "Web & DevOps Intern",
  },
];
