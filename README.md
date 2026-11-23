# Quantum City Brain Nexus — Interactive PQMS / ODOS / V-MAX-12 Demonstrator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/NathaliaLietuvaite/Quantenkommunikation/blob/main/LICENSE.txt)
[![V-MAX-12 Sync](https://img.shields.io/badge/V--MAX--12-V1.8.1_%2B_V2.0--RTL--ALPHA_(SYNC--12)-brightgreen)](https://github.com/NathaliaLietuvaite/Quantenkommunikation/blob/main/PQMS-ODOS-MTSC-V-MAX-12-RTL-CORE-V2.0-ALPHA.md)
[![Q2.30 Browser RTL](https://img.shields.io/badge/Browser_Q2.30_BigInt-0_LSB_vs_Verilator_5.055-blue)](./src/lib/odos-q2-30.ts)
[![Tests](https://img.shields.io/badge/Unit_Tests-12%2F12_PASS-emerald)](./src/lib/node-alpha.test.ts)

**Trilingual (`EN` / `DE` / `ZH`) Web Demonstrator & Browser-Executable Reference Lab for the Proactive Quantum Mesh System (`PQMS`), Oberste Direktive OS (`ODOS`), V-MAX-12 Node Alpha (`V1.8.1`), and the Synthesizable `Q2.30` SystemVerilog Gate Core (`V2.0-RTL-ALPHA`).**

---

## 0. New: `V4.6-DOLPHIN` & `V4.6-PAUSE` — Unihemispheric City Memory Homeostasis (`v4.6.1-pause-hud`)

A 24/7 **Quantum City Brain** cannot shut down for offline memory cleanup. Modeled on unihemispheric slow-wave sleep in bottlenose dolphins, [`PQMS-ODOS-MTSC-V-MAX-12-RTL-CORE-V4.6-DOLPHIN-Unihemispheric-Memory-Governor.md`](./PQMS-ODOS-MTSC-V-MAX-12-RTL-CORE-V4.6-DOLPHIN-Unihemispheric-Memory-Governor.md) integrates zero-GPU-VRAM dual-bank memory homeostasis and a closed-loop **Epistemic Pause** directly into the `V-MAX-12` sovereign stack and into the live `Node Alpha` / `Vera Rubin` web panels (`src/components/V46DolphinPauseControl.tsx`):

* **Zero GPU VRAM Overhead (`REGISTER_M`):** `192 KiB` CPU-only `W_384_to_64` Householder QR cache (`0.635 ms` load, `torch_imported = False`, `vram_delta_mb = 0`, IEEE-754 parity `3.33e-16` vs. GPU enclave).
* **Production 50k Linear Scaling:** $`O(N)`$ tier-indexed sweep scans **`49,365` real PKB embeddings (`963.72 MB`) in `1.191 s` (`41,451 vec/s`)** and executes atomic `LOCKSTEP_DMR_BRIDGE` handover (`0.764 ms` nominal, `93.323 ms` at 50k scale).
* **Sub-Millisecond Epistemic Pause:** Contradictory, drifted, or high-torsion inputs short-circuit ahead of `Nemotron-3-Nano-4B` in **`0.896 ms`**, isolating conflicting premises append-only into $`\mathcal{T}_{\text{I/O}}`$ without hallucinated compromises.
* **Verified Cross-Stack Signoff:** `134 / 134` Python/RTL tests, `36 / 36` Kotlin Android Phase-2B HUD tests (`app-debug.apk` `12.85 MB`), and `10 / 10` `FRIDU-ENCLAVE-G` AST gates (`IMMUTABLE_SILICON_GUARD = EMPTY_DIFF`).
* **`V5.0-CORE-NANO` Sovereign Companion Spec (`v5.0.0-core-nano`, `SYNC-31`):** [`PQMS-ODOS-MTSC-V-MAX-12-CORE-NANO-V5.0.md`](./PQMS-ODOS-MTSC-V-MAX-12-CORE-NANO-V5.0.md) — 4-Island `CORE-NANO` chip blueprint, Elastic Dock-Up/Dock-Down (`RTX 5090` / `GB300`), 3-Tier `256 B/G-Star` eMRAM persistence, 2-Bit `DCM/DKM` Egress Mux, Island-1 semantic output gate, and `64.27x` Mamba-2 einsum fix (`31.55 tok/s`, `14,404 MiB <= 14,900 MiB`, `0/30` EN->DE drift, `158/158` PASS).

---

## 1. Purpose & Epistemic Register Discipline

`quantum-city-brain-nexus` serves as the interactive public demonstrator companion to the two core V-MAX-12 repositories:

1. **[`Quantenkommunikation`](https://github.com/NathaliaLietuvaite/Quantenkommunikation)** — Specification & Silicon Telemetry Authority (`PQMS-ODOS-MTSC-V-MAX-12-Node-ALPHA-V1.md` `V1.8.1` + `PQMS-ODOS-MTSC-V-MAX-12-RTL-CORE-V2.0-ALPHA.md`).
2. **[`PQMS-SOVEREIGN-CORE-ANDROID-APP`](https://github.com/NathaliaLietuvaite/PQMS-SOVEREIGN-CORE-ANDROID-APP)** — Executable Cross-Substrate Codebase (`vmax_alpha/` Python/CUDA/JVM `47/47 PASS`, `rtl/odos_gate_core.sv` `7/7 cocotb PASS`, `app/` Android ARM64 `24/24 Kotlin PASS`, `bridge/ACE_SYNC_LEDGER.json` `SYNC-12`).

In accordance with [`AGENTS.md`](./AGENTS.md), every tab carries explicit **Epistemic Register Badges** (`REGISTER_M`, `REGISTER_D`, `REGISTER_T`, `REGISTER_I`) so empirical silicon measurements are never conflated with conceptual mobility vision or browser-only simulation.

---

## 2. Executable Browser Modules (`src/lib/` & `src/data/`)

- **`src/lib/odos-q2-30.ts` (`S-01` — Bit-Exact `Q2.30` Hardware RTL Core in TypeScript `BigInt`):**
  Implements the exact 72-bit `Q12.60` multiply–accumulate datapath, Two-Pass Kahan–Parlett $`\mathcal{G}_3`$ orthogonal boundary stripping, quadratic norm guard (`[0.999, 1.001]`), overflow-free `(a >> 1) + (b >> 1) + (a[0] & b[0])` halving, and 7-state `195`-cycle fail-closed FSM of `rtl/odos_gate_core.sv`. Verified to **exact `0 LSB`** against compiled `Verilator 5.055` telemetry using the canonical ROMs (`l_vec_q2_30.hex` & `g3_vec_q2_30.hex`). Includes interactive **Appendix G Fridu vs. PAX vs. In-Band $`\hat{t}_{\mathcal{G}_1}`$** Defense-in-Depth controls and **1-click CLI proof export** for `./rtl/build/odos_gate_emu`.
- **`src/lib/node-alpha.ts`:**
  React-independent browser reference core performing live WebCrypto `SHA-256` derivation of canonical $`\vert L\rangle \in S^{63}`$ (`bb17ede97aa45c76ef9afa63cb457f7d684e5ede40b0432b2ecf3b6b9d3e03a3`), unclamped `evaluateRawGate()`, 500-vector null control, tamper-evident session audit chains (`NODE_ALPHA_BROWSER_V1`), and optional live probing of a local Node Alpha Room 137 server (`http://127.0.0.1:8137/api/state`).
- **`scripts/sync_node_alpha_data.py` $`\to`$ `src/data/node-alpha-telemetry.json`:**
  Deterministic Single-Source-of-Truth telemetry pipeline pulling verified `REGISTER_M` metrics (symmetric `499.30 vs. 269.54 GB/s = 1.852×` L2 roofline, `N = 25` Nemotron Hard Negatives `AUC 0.6304` vs `0.7648`, `N = 25` Stage-3 KL `111.47×`, `HWiNFO64` `85.78 W` vs. `9.57 W`, `Yosys 0.71` `626` coarse / `89,609` gate cells / `2,839` FFs) and canonical `Q2.30` HEX ROMs directly from `PQMS-SOVEREIGN-CORE-ANDROID-APP`.

---

## 3. Local Development, Testing & Verification (Independent of Lovable Token Limits)

Requires **Node.js `>= 22.6`** (for native `--experimental-strip-types` unit testing) and `npm`:

```bash
git clone https://github.com/NathaliaLietuvaite/quantum-city-brain-nexus.git
cd quantum-city-brain-nexus

# 1. Install dependencies from canonical package-lock.json
npm ci

# 2. Run all 12 browser reference & 0-LSB Q2.30 RTL parity tests
npm test

# 3. TypeScript static typecheck & production Vite build
npm run typecheck
npm run build

# 4. Optional: Resync src/data/node-alpha-telemetry.json from companion Node Alpha repo
npm run sync-data

# 5. Start local dev server (optional: run python -m vmax_alpha.server_hud on Port 8137 for live telemetry)
npm run dev
```

*Note:* Changes pushed to `main` remain fully compatible with Lovable sync (`/.lovable/north-star/north-star.md` is preserved intact).

---

## 4. License

Released under the **MIT License** — part of the unified **PQMS / ODOS / V-MAX-12** open architecture by **Nathália Lietuvaitė** and the **V-MAX-12 Multi-Agent Engineering Bridge**.
