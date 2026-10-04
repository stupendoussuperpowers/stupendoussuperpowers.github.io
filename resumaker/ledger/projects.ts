import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "witness",
    title: "Witness (CNCF)",
    link: "https://github.com/in-toto/go-witness",
    repo: "in-toto/go-witness",
    tag: "Open Source",
    role: "Maintainer",
    blurb:
      "Witness is a pluggable framework for software supply chain risk management. It automates, normalizes, and verifies software artifact provenance.",
    bullets: [
      "Maintainer, witness and go-witness. Worked on integrating eBPF support for low-overhead build tracing.",
    ],
  },
  {
    id: "hfs-freebsd",
    title: "HFS+ Port For FreeBSD",
    tech: "C",
    tag: "Open Source",
    link: "https://www.freebsd.org/status/report-2025-04-2025-06/#_porting_hfs_to_freebsd | FreeBSD Status Report",
    repo: "stupendoussuperpowers/freebsd_hfs",
    report:
      "https://www.freebsd.org/status/report-2025-04-2025-06/#_porting_hfs_to_freebsd | FreeBSD Tracker",
    role: "Author",
    blurb:
      "A kernel module implementing Apple's HFS+ filesystem for FreeBSD 14 — modernizing the VFS-layer APIs, removing Darwin dependencies, and building the mount_hfs, newfs_hfs, and fsck_hfs userland utilities.",
    bullets: [
      "Ported Apple's open-source HFS+ filesystem to FreeBSD 14, adapting kernel VFS-layer operations to modern FreeBSD interfaces.",
      "Developed userland utilities for mounting and management of HFS+ volumes.",
    ],
  },
  {
    id: "cargo",
    title: "Cargo",
    tech: "Rust",
    tag: "Open Source",
    link: "https://github.com/stupendoussuperpowers/cargo",
    repo: "stupendoussuperpowers/cargo",
    role: "Contributor",
    bullets: [
      "Contributor to Cargo, Rust's official package manager and build system.",
    ],
    blurb:
      "Contributor to Cargo, Rust's official package manager and build system.",
  },
  {
    id: "trunk",
    title: "Trunk",
    tag: "Open Source",
    link: "https://github.com/stupendoussuperpowers/trunk",
    repo: "stupendoussuperpowers/trunk",
    blurb:
      "A POSIX tail that supports grepping a log stream while it is still being written, via --follow.",
  },
  {
    id: "gilbert",
    title: "Gilbert",
    tag: "Open Source",
    link: "https://github.com/stupendoussuperpowers/gilbert",
    repo: "stupendoussuperpowers/gilbert",
    blurb:
      "A local stand-in for Google App Engine, so services can be run and tested without deploying to GCP. Grew out of the CI/CD work at LegalAI.",
  },

  {
    id: "hpml-llm",
    title: "Comparing Training Efficiency for Large Language Models",
    tag: "Course Projects",
    link: "https://github.com/brian-xue/HPML-proj",
    repo: "brian-xue/HPML-proj",
    report: "/comparing-llm-training-methods.pdf",
    blurb:
      "Compares LLM fine-tuning strategies and documents the trade-offs between them: PEFT (LoRA, QLoRA, GoRA), quantization, and distributed-GPU training (DDP and FSDP).",
  },
  {
    id: "bloom-filters",
    title: "Improving Learned Bloom Filters",
    tag: "Course Projects",
    link: "https://github.com/stupendoussuperpowers/wise-bloom-filters",
    repo: "stupendoussuperpowers/wise-bloom-filters",
    report:
      "https://github.com/stupendoussuperpowers/wise-bloom-filters/blob/main/Improving_Learned_Bloom_Filters.pdf",
    blurb:
      "Benchmarks optimization techniques for Learned Bloom Filters, weighing false-positive rate against memory use across Projection Hashing, Caching, and LoRA.",
    bullets: [
      "Benchmarked optimization techniques for Learned Bloom Filters, evaluating the trade-off between false-positive rate and memory efficiency across Projection Hashing, Caching, and LoRA.",
    ],
  },
  {
    id: "talk2data",
    title: "Talk2Data",
    tech: "Python, Google Cloud Platform (GCP)",
    tag: "Course Projects",
    link: "https://github.com/Sitanshuk/Talk2Doc",
    repo: "Sitanshuk/Talk2Doc",
    report: "https://github.com/Sitanshuk/Talk2Doc/blob/master/Talk2Data.pdf",
    blurb:
      "A single place for college students to keep their academic and professional data. It pulls from Notion and Gmail to track job applications, and uses RAG over personal notes so they can be queried in plain language.",
    bullets: [
      "Built GCP data pipelines that extract and organize Gmail and Notion data into job applications, course materials, and deadlines.",
      "Implemented RAG-backed chat interfaces over that data using personalized LLMs, with load-efficient hosting on GCP.",
    ],
  },
  {
    id: "mta-ridership",
    title: "MTA Ridership Prediction",
    tech: "Python",
    tag: "Course Projects",
    link: "https://github.com/stupendoussuperpowers/mta-ridership",
    repo: "stupendoussuperpowers/mta-ridership",
    report:
      "https://github.com/stupendoussuperpowers/mta-ridership/blob/main/NYC_Subway_Transit_Ridership_Prediction.pdf",
    blurb:
      "Predicts NYC subway ridership from temporal and fare-class features, and clusters stations to surface neighborhood-level traffic patterns.",
    bullets: [
      "Trained ML models to predict NYC subway ridership from temporal and fare-class features; applied K-Shape clustering to uncover neighborhood-level ridership patterns across the system.",
    ],
  },
];
