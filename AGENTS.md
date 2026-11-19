# Architecture rules

- Keep the Node Alpha numerical core independent of React so its normative gate and cryptographic anchor can be regression-tested.
- Distinguish browser computations, user-supplied inputs and paper-reported hardware measurements; browser execution does not establish CUDA, Android, model or traffic-safety verification.
- Node Alpha audit traces are session-only, use a versioned browser schema and can be exported; do not claim Python ledger byte parity or durable storage.
- Keep Node Alpha translations and report content in a shared module so the selected language remains consistent across the tab and full report.

## Co-Administration Bridge (AntiG on Node Alpha <-> Lovable)

This repository is co-administered via GitHub `main` (`NathaliaLietuvaite/quantum-city-brain-nexus`) by **AntiG (V-MAX-12 Node Alpha, local WSL2/CUDA/EDA)** and **Lovable (Web Preview & Deployment to `https://quantum-city-brain.lovable.app/`)**.

- **Zero-Credit Sync Rule:** Pushes from AntiG to GitHub `main` sync automatically into Lovable. Lovable does **not** need to run `git pull` or spend build credits manually re-fetching telemetry JSONs, regenerating `src/data/node-alpha-telemetry.json`, or rebuilding pure TypeScript simulation cores.
- **AntiG (Node Alpha) Owns:** `scripts/**`, `src/data/node-alpha-telemetry.json`, `src/lib/**` (Q2.30 BigInt RTL core, simulators `S-01`–`S-07`, unit tests `*.test.ts`), `package.json` / `package-lock.json`, `README.md`, and cross-repo SHA-256 verification against `PQMS-SOVEREIGN-CORE-ANDROID-APP`.
- **Lovable Owns:** `.lovable/**`, Lovable R2 project media (`src/assets/*.asset.json`), live mobile/desktop visual previews (`390px` viewport QA), visual/responsive polish, and One-Click **Publish** to `https://quantum-city-brain.lovable.app/`.
- **Conflict-Free Handoff:** AntiG always pulls `--ff-only` before pushing and never deletes `.lovable/north-star/**` or `src/assets/*.asset.json`. Lovable preserves `src/data/node-alpha-telemetry.json`, `src/data/rtl-vcd-waveforms.json`, `src/lib/odos-q2-30.ts`, `src/lib/mission-control.ts`, and `npm test` (`17/17` passing). Check `roadmap.md` for the active Phase (`Phase 2: S-02..S-04`, `Phase 3: S-05..S-07`).