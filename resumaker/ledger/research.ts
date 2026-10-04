import type { Research } from "./types";

export const research: Research[] = [
  {
    id: "sbomit",
    org: "SBOMit (OpenSSF)",
    title: "SBOMit (OpenSSF)",
    link: "https://sbomit.dev",
    roleTag: "Maintainer / Researcher",
    when: "2025-09 /",
    blurb:
      "OpenSSF initiative to augment Software Bills of Materials (SBOMs) with build time in-toto attestations.",
    bullets: [
      "Extended [witness](https://github.com/in-toto/witness), in-toto's Go implementation, with eBPF-based attestors that trace a build's filesystem and network activity at a low overhead to identify build inputs.",
      "Built Docker extensions for witness so builds that run in containers are still observed and attested.",
      "Reconciled in-toto attestation evidence with SBOMs produced by Software Composition Analysis tools, surfacing components that manifest-based SBOMs miss.",
      "Compared SBOMit's threat model and accuracy against Syft and Trivy, identifying build time attack vectors that manifest based SBOM tools cannot see [@scored26].",
    ],
  },
  {
    id: "lind",
    org: "Lind-Wasm & 3i (Secure Systems Lab)",
    title: "Lind-Wasm & 3i (Secure Systems Lab)",
    link: "https://github.com/Lind-Project/lind-wasm",
    repo: "Lind-Project/lind-wasm",
    roleTag: "Contributor / Researcher",
    when: "2025-07 / 2026-07",
    blurb:
      "WebAssembly sandbox for isolating unmodified POSIX applications, with 3i routing system calls through composable userspace policies.",
    bullets: [
      "Implemented and designed parts of policy composition on 3i so that independently written syscall policies (grates) can be chained, conditionally routed, or duplicated per process.",
      "Built an in-memory filesystem grate that gives sandboxed processes private, trusted file storage, used for C compilation inside Intel SGX enclaves.",
      "Built a Rust library of safe libc and 3i bindings, to extend Lind's support for Rust programs and grates.",
      "Built a benchmark suite measuring sandbox overhead, per-grate dispatch cost, and filesystem throughput, and used it to optimize syscall resolution.",
    ],
  },
];
