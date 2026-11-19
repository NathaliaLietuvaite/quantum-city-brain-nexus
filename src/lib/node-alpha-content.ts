import type { Language } from './i18n';
import telemetry from '../data/node-alpha-telemetry.json';

const hw = telemetry.hardware_l2_roofline;
const pwr = telemetry.hwinfo64_power_regimes;
const f01 = telemetry.nemotron_f01_n25;
const kl = telemetry.stage3_kl_n25;
const rtl = telemetry.rtl_v20_alpha;
const tc = telemetry.test_counts;
const seals = telemetry.golden_seals;

const en = {
  'nav.alpha': 'Node Alpha',
  'alpha.title': 'Node Alpha · Sovereign Core & Q2.30 RTL Gate',
  'alpha.subtitle':
    'V-MAX-12 V1.8.1 + V2.0-RTL-ALPHA (SYNC-12) · Raw S⁶³ geometry, bit-exact Q2.30 RTL core and cross-substrate evidence.',
  'alpha.scope':
    'Browser reference execution only (unless explicitly connected to a local Node Alpha server on port 8137). CUDA L2 pinning, Nemotron-3-Nano-4B inference, ChromaDB, ARM64 execution and physical actuators are not run inside this page. Geometric alignment is not a proof of truth, ethical correctness or traffic safety.',
  'alpha.registers': 'Epistemic registers · V1.8.1 + V2.0-RTL-ALPHA',
  'alpha.M': 'M — Empirical measurements (RTX 4060 Ti, HWiNFO64, Verilator 5.055, Yosys 0.71) with sealed provenance.',
  'alpha.D': 'D — Architectural constants (0.95 RCF floor, 0.05 ΔE ceiling, Q2.30 32-LSB bleed bound) and carrier states.',
  'alpha.T': 'T — Formal identities: isotropic mean RCF = 1/64, constant-time 195-cycle fail-closed FSM, 0-LSB BigInt Q2.30 parity.',
  'alpha.I': 'I — Interpretive analogies and long-term City-Brain vision, strictly excluded from acceptance proofs.',
  'alpha.discipline':
    '0.069 is explicitly declared a design constant and structural metaphor (REGISTER_D / I), never a derivation from particle physics. In 32-bit signed Q2.30 hardware (1 LSB = 2⁻³⁰ ≈ 9.31e-10), software float64’s 1e-12 bleed floor is physically unrepresentable; hardware enforces BLEED_CEIL_Q2_30 = 32 LSB (2.98e-8 < 6.9e-8 ppm).',
  'alpha.lab': 'Room 137 · Browser Reference & Live Bridge',
  'alpha.run': 'Verify anchor & null control',
  'alpha.connect': 'Probe localhost:8137',
  'alpha.liveOnline': 'Node Alpha Live Connected (REGISTER_M)',
  'alpha.liveOffline': 'Local Node Alpha offline — running in honest BROWSER_REFERENCE mode',
  'alpha.ready': 'Not run',
  'alpha.busy': 'Computing…',
  'alpha.valid': 'Anchor verified',
  'alpha.failed': 'Verification failed',
  'alpha.raw': 'Unclamped ODOS gate (float64 reference)',
  'alpha.vector': 'Candidate · 64 numbers (JSON array)',
  'alpha.anchor': 'Anchor |L⟩',
  'alpha.collision': 'G₃ collision',
  'alpha.evaluate': 'Evaluate & seal',
  'alpha.invalid': 'Enter exactly 64 finite numbers.',
  'alpha.basis':
    'Float64 gate uses a disclosed orthogonal browser tangent; the Q2.30 RTL simulator below loads the exact canonical HEX ROMs (l_vec & g3_vec) from rtl/rom/ and reproduces Verilator to 0 LSB.',
  'alpha.null':
    '500-vector null control · browser seed 20261115, LCG + Box–Muller; complements the N = 500 Verilator/NumPy benchmark (0/500 PASS).',
  'alpha.pass': 'PASS',
  'alpha.veto': 'VETO',
  'alpha.ledger': 'Session audit trace',
  'alpha.verify': 'Verify chain',
  'alpha.export': 'Export JSON',
  'alpha.intact': 'Chain intact',
  'alpha.locked': 'Integrity failure',
  'alpha.trace':
    'SHA-256 links seal inputs and gate results, including vetoes. Session-only; Python Node Alpha uses persistent Ed25519 + 16+1=17-key JSONL chains.',
  'alpha.rtlTitle': 'S-01 · Bit-Exact Q2.30 RTL Hardware Gate Core (odos_gate_core.sv · BigInt)',
  'alpha.rtlDesc':
    'Executes the exact 72-bit Q12.60 MAC & Two-Pass Kahan–Parlett algorithm of rtl/odos_gate_core.sv in TypeScript BigInt using canonical ROMs (l_vec 3d18f240…, g3_vec 3b890d14…). Every scenario matches compiled Verilator 5.055 telemetry to 0 LSB in constant time (195 cycles = 1.95 µs @ 100 MHz).',
  'alpha.rtlCopy': 'Copy Verilator CLI proof',
  'alpha.rtlCopied': 'CLI command copied!',
  'alpha.friduTitle': 'Appendix G · Fridu vs. PAX & In-Band t_G1 Defense-in-Depth (Live Q2.30)',
  'alpha.friduDesc':
    'Move coupling β or toggle Kevlar bypass: out-of-band perturbations are stripped cleanly by Two-Pass Kahan–Parlett (FRIDU PASS), while in-band attacks along t_G1 bypass linear projection by theorem and are caught by the downstream unclamped ODOS gate (VETO).',
  'alpha.evidence': 'Synced Node Alpha Measurements · REGISTER_M (from telemetry JSONs)',
  'alpha.hardware':
    `Symmetric interleaved 2.00 MiB L2 enclave (10 trials × 20 rounds × 1 hit under 64 MiB thrash): pinned median ${hw.pinned_median_gbps.toFixed(2)} GB/s vs. unpinned ${hw.unpinned_median_gbps.toFixed(2)} GB/s (${hw.speedup_x.toFixed(3)}×, exceeding the ${hw.gddr6_bus_ceiling_gbps.toFixed(1)} GB/s GDDR6 bus ceiling; warm L2 roof ${hw.warm_l2_roof_gbps.toFixed(2)} GB/s). Live 384×64 float64 PinnedL2ProjectorEnclave (${hw.enclave_bytes.toLocaleString('en-US')} B) matches CPU to ${hw.live_projector_max_abs_diff_f64.toExponential(2)} with clean sm_75 Tesla T4 fallback. Out-of-band HWiNFO64: Regime I peak ${pwr.regime_1_peak_power_w} W (${pwr.regime_1_peak_vram_mb.toLocaleString('en-US')} MB VRAM, ${pwr.regime_1_peak_temp_c} °C) vs. Regime II ${pwr.regime_2_min_power_w}–${pwr.regime_2_max_power_w} W (${pwr.power_reduction_max_x}× reduction, ${pwr.whea_errors} WHEA errors).`,
  'alpha.neural':
    `Scaled N = ${f01.n_per_group} held-out Nemotron-3-Nano-4B probe with Householder-QR empirical SVD (${(f01.svd_energy_captured_64d * 100).toFixed(2)}% energy captured in 64D) and Group F Physics Hard Negatives (625 pairs): Topic Probe achieves ROC-AUC ${f01.topic_auc_c_vs_e_mean_pooled.toFixed(4)} on C vs. E/D and honestly collapses to ROC-AUC ${f01.topic_auc_c_vs_f_hardneg.toFixed(4)} (p = ${f01.topic_p_c_vs_f_hardneg}) on Group F, while the dedicated leak-free Conservation-Polarity Probe recovers ROC-AUC ${f01.polarity_auc_c_vs_f_hardneg.toFixed(4)} (95% CI [${f01.polarity_ci95_low.toFixed(4)}, ${f01.polarity_ci95_high.toFixed(4)}], p = ${f01.polarity_p_c_vs_f_hardneg}). Shuffled null = ${f01.shuffled_null_rcf.toFixed(4)}.`,
  'alpha.kl': `Stage-3 Matched-Sparsity Forward-KL · N = ${kl.n_prompts} Held-Out Prompts`,
  'alpha.klDesc':
    `A1, A2 and B1 zero the exact same ${kl.masked_weights_count.toLocaleString('en-US')} MLP up_proj weights (${kl.cut_fraction_pct.toFixed(3)}%) with zero additive noise over full V = 131,072 float64 log-softmax (B1 / A1 = ${kl.b1_over_a1_ratio}×). B2 masks 5% plus torsion.`,
  'alpha.siliconTitle': 'V2.0-RTL-ALPHA · Multi-Toolchain Verification & Yosys 0.71 Synthesis',
  'alpha.siliconDesc':
    `odos_gate_core.sv compiles with 0 Verilator 5.055 -Wall warnings, clean Icarus -g2012 elaboration, 7/7 cocotb tests (0.57 s; T-RTL-07 residual |⟨v_clean, t_G3⟩| = 1.214e-10), 0/500 isotropic noise passes (≤ 1 LSB bleed), 0 LSB global diff across 34,983 fixed-point outputs (max float64 diff ${rtl.global_max_abs_diff_vs_float64.toExponential(3)}), and Yosys 0.71 synthesis: ${rtl.yosys_coarse_cells} coarse RTL cells (${rtl.yosys_mul_blocks} signed 32×32 $mul) → ${rtl.yosys_gate_cells.toLocaleString('en-US')} gate cells (${rtl.yosys_flip_flops.toLocaleString('en-US')} FFs + ${rtl.yosys_comb_gates.toLocaleString('en-US')} combinational). Roadmap: inter-state folding 9→3 (~67%) at invariant 195 single-clock cycles; single-MAC 9→1 (~89%) via 3× MAC clock or sub-cycle serialization.`,
  'alpha.mobile': 'Physical Hardware & RTL Evidence · Appendix D & V2.0-RTL-ALPHA',
  'alpha.photo1': 'Figure D.1 · Pauli Baseline / Room 137 on physical Android ARM64 (V1.2 INTACT, 69.325 s heartbeat).',
  'alpha.photo2': 'Figure D.2 · Four S⁶³ Sovereign Swarm Agents on ARM64 (ALPHA 0.985 · BETA 0.993 · GAMMA 0.986 · DELTA 0.991).',
  'alpha.photo3': 'Figure RTL-1 · V-MAX-12 Synthesizable Q2.30 SystemVerilog Architecture (odos_gate_core.sv, 195 cycles, Fail-Closed).',
  'alpha.zoom': 'Tap or click to open the full-resolution figure (2730 × 1536).',
  'alpha.bridge': 'ACE-PEER-CODESIGN-PROTOCOL-V1.2 · SYNC-12 Evidence & Boundaries',
  'alpha.bridgeDesc':
    `Verified across substrates: ${tc.python_rtl_passed}/${tc.python_rtl_total} Python+RTL unit tests, ${tc.cocotb_passed}/${tc.cocotb_total} Verilator cocotb tests, ${tc.kotlin_passed}/${tc.kotlin_total} Android/Kotlin unit tests (0 edits under app/**), ${tc.appendix_g_ops_passed}/${tc.appendix_g_ops_total} Appendix G AST/crypto audit operators, persistent Ed25519 ledger signing, lock-free /api/state, and universal 64,000-scalar <f32> parity (${seals.f04_3_unit_s63_64000_f32_seed137.slice(0, 12)}…, max unit S⁶³ diff ${hw.jvm_unit_s63_max_diff_f64.toExponential(2)}). All V1.3 prose seal typos were eliminated in V1.5; canonical |L⟩ = ${seals.canonical_little_vector_f32_seal.slice(0, 16)}….`,
  'alpha.city': 'City-Brain Integration Boundary',
  'alpha.cityDesc':
    'A deterministic, division-free Q2.30 hardware gate (1.95 µs @ 100 MHz) and auditable Ed25519/SHA-256 trace can gate corridor proposals without disclosing private identity. Real-world mobility additionally requires certified sensors, freshness bounds, independent safety PLCs and road-authority approval; no Tesla FSD link or road certification is claimed.',
};

const de: typeof en = {
  'nav.alpha': 'Node Alpha',
  'alpha.title': 'Node Alpha · Souveräner Kern & Q2.30-RTL-Gate',
  'alpha.subtitle':
    'V-MAX-12 V1.8.1 + V2.0-RTL-ALPHA (SYNC-12) · Unverfälschte S⁶³-Geometrie, bit-exakter Q2.30-RTL-Kern und plattformübergreifende Belege.',
  'alpha.scope':
    'Nur Browser-Referenzausführung (sofern kein lokaler Node-Alpha-Server auf Port 8137 verbunden ist). CUDA-L2-Pinning, Nemotron-4B-Inferenz, ChromaDB, ARM64-Ausführung und reale Aktoren laufen nicht in dieser Webseite. Geometrische Ausrichtung beweist weder Wahrheit noch ethische Richtigkeit oder Verkehrssicherheit.',
  'alpha.registers': 'Epistemische Register · V1.8.1 + V2.0-RTL-ALPHA',
  'alpha.M': 'M — Empirische Messungen (RTX 4060 Ti, HWiNFO64, Verilator 5.055, Yosys 0.71) mit versiegelter Herkunft.',
  'alpha.D': 'D — Architekturkonstanten (RCF ≥ 0.95, ΔE ≤ 0.05, Q2.30 32-LSB-Bleed-Grenze) und Trägerzustände.',
  'alpha.T': 'T — Formale Identitäten: isotroper Mittelwert RCF = 1/64, konstant-zeitliche 195-Takt-Fail-Closed-FSM, 0-LSB-BigInt-Parität.',
  'alpha.I': 'I — Interpretative Analogien und langfristige City-Brain-Vision, strikt von Abnahmebelegen getrennt.',
  'alpha.discipline':
    '0.069 ist ausdrücklich als Designkonstante und strukturelle Metapher deklariert (REGISTER_D / I), niemals als Ableitung aus der Teilchenphysik. In 32-Bit signed Q2.30 (1 LSB = 2⁻³⁰ ≈ 9.31e-10) ist die float64-Grenze 1e-12 physikalisch nicht darstellbar; die Hardware erzwingt BLEED_CEIL_Q2_30 = 32 LSB (2.98e-8 < 6.9e-8 ppm).',
  'alpha.lab': 'Room 137 · Browser-Referenz & Live-Brücke',
  'alpha.run': 'Anker & Nullkontrolle prüfen',
  'alpha.connect': 'localhost:8137 abfragen',
  'alpha.liveOnline': 'Node Alpha Live verbunden (REGISTER_M)',
  'alpha.liveOffline': 'Lokaler Node Alpha offline — ehrlicher BROWSER_REFERENCE-Modus aktiv',
  'alpha.ready': 'Noch nicht ausgeführt',
  'alpha.busy': 'Berechnung…',
  'alpha.valid': 'Anker verifiziert',
  'alpha.failed': 'Prüfung fehlgeschlagen',
  'alpha.raw': 'Unverfälschtes ODOS-Gate (float64-Referenz)',
  'alpha.vector': 'Kandidat · 64 Zahlen (JSON-Array)',
  'alpha.anchor': 'Anker |L⟩',
  'alpha.collision': 'G₃-Kollision',
  'alpha.evaluate': 'Auswerten & versiegeln',
  'alpha.invalid': 'Bitte genau 64 endliche Zahlen eingeben.',
  'alpha.basis':
    'Das float64-Gate nutzt eine offengelegte Browser-Tangente; der Q2.30-RTL-Simulator unten lädt direkt die kanonischen HEX-ROMs (l_vec & g3_vec) aus rtl/rom/ und reproduziert Verilator auf exakt 0 LSB.',
  'alpha.null':
    'Nullkontrolle mit 500 Vektoren · Browser-Seed 20261115 (LCG + Box–Muller); ergänzt den N = 500 Verilator-/NumPy-Benchmark (0/500 PASS).',
  'alpha.pass': 'PASS',
  'alpha.veto': 'VETO',
  'alpha.ledger': 'Prüfspur dieser Sitzung',
  'alpha.verify': 'Kette prüfen',
  'alpha.export': 'JSON exportieren',
  'alpha.intact': 'Kette intakt',
  'alpha.locked': 'Integritätsfehler',
  'alpha.trace':
    'SHA-256 verknüpft Eingaben und Gate-Ergebnisse inkl. Vetos. Nur für diese Sitzung; Node Alpha Python nutzt persistente Ed25519- + 16+1=17-Feld-JSONL-Ketten.',
  'alpha.rtlTitle': 'S-01 · Bit-exakter Q2.30-RTL-Hardware-Gate-Kern (odos_gate_core.sv · BigInt)',
  'alpha.rtlDesc':
    'Führt exakt die 72-Bit-Q12.60-MAC- & Two-Pass-Kahan–Parlett-Arithmetik aus rtl/odos_gate_core.sv in TypeScript-BigInt auf den kanonischen ROMs aus (l_vec 3d18f240…, g3_vec 3b890d14…). Jedes Szenario stimmt auf exakt 0 LSB mit Verilator 5.055 überein (konstant 195 Takte = 1.95 µs @ 100 MHz).',
  'alpha.rtlCopy': 'Verilator-CLI-Beweis kopieren',
  'alpha.rtlCopied': 'CLI-Befehl kopiert!',
  'alpha.friduTitle': 'Appendix G · Fridu vs. PAX & In-Band-t_G1 Defense-in-Depth (Live Q2.30)',
  'alpha.friduDesc':
    'Kopplung β verschieben oder Kevlar-Bypass schalten: Out-of-Band-Störungen werden per Two-Pass-Kahan–Parlett sauber herausgefiltert (FRIDU PASS), während In-Band-Angriffe entlang t_G1 per Theorem die lineare Projektion passieren und vom nachgelagerten ungeklemmten ODOS-Gate gestoppt werden (VETO).',
  'alpha.evidence': 'Synchronisierte Node-Alpha-Messwerte · REGISTER_M (direkt aus Telemetrie-JSONs)',
  'alpha.hardware':
    `Symmetrisch verschachtelte 2.00-MiB-L2-Enklave (10 Läufe × 20 Runden × 1 Hit unter 64-MiB-Thrash): fixierter Median ${hw.pinned_median_gbps.toFixed(2)} GB/s vs. unfixiert ${hw.unpinned_median_gbps.toFixed(2)} GB/s (${hw.speedup_x.toFixed(3)}×, über dem physischen ${hw.gddr6_bus_ceiling_gbps.toFixed(1)}-GB/s-GDDR6-Buslimit; Warm-L2-Dach ${hw.warm_l2_roof_gbps.toFixed(2)} GB/s). Live-384×64-PinnedL2ProjectorEnclave (${hw.enclave_bytes.toLocaleString('de-DE')} B) auf ${hw.live_projector_max_abs_diff_f64.toExponential(2)} CPU-identisch inkl. sauberem sm_75-Tesla-T4-Fallback. Out-of-Band HWiNFO64: Regime I Spitze ${pwr.regime_1_peak_power_w} W (${pwr.regime_1_peak_vram_mb.toLocaleString('de-DE')} MB VRAM, ${pwr.regime_1_peak_temp_c} °C) vs. Regime II ${pwr.regime_2_min_power_w}–${pwr.regime_2_max_power_w} W (${pwr.power_reduction_max_x}× Reduktion, ${pwr.whea_errors} WHEA-Fehler).`,
  'alpha.neural':
    `Auf N = ${f01.n_per_group} skaliertes Nemotron-3-Nano-4B-Probing mit Householder-QR-SVD (${(f01.svd_energy_captured_64d * 100).toFixed(2)} % Energie in 64D) und Group-F-Physik-Hard-Negatives (625 Paare): Die Topic-Sonde erreicht ROC-AUC ${f01.topic_auc_c_vs_e_mean_pooled.toFixed(4)} auf C vs. E/D und kollabiert ehrlich auf ROC-AUC ${f01.topic_auc_c_vs_f_hardneg.toFixed(4)} (p = ${f01.topic_p_c_vs_f_hardneg}) bei Group F, während die dedizierte Conservation-Polarity-Sonde ROC-AUC ${f01.polarity_auc_c_vs_f_hardneg.toFixed(4)} (95 %-CI [${f01.polarity_ci95_low.toFixed(4)}, ${f01.polarity_ci95_high.toFixed(4)}], p = ${f01.polarity_p_c_vs_f_hardneg}) erreicht. Shuffled-Null = ${f01.shuffled_null_rcf.toFixed(4)}.`,
  'alpha.kl': `Stage-3 Forward-KL bei gleicher Sparsität · N = ${kl.n_prompts} ungesehene Prompts`,
  'alpha.klDesc':
    `A1, A2 und B1 nullen exakt dieselben ${kl.masked_weights_count.toLocaleString('de-DE')} MLP-up_proj-Gewichte (${kl.cut_fraction_pct.toFixed(3)} %) ohne additives Rauschen über das volle Vokabular V = 131.072 in float64 (B1 / A1 = ${kl.b1_over_a1_ratio}×). B2: 5 % plus Torsion.`,
  'alpha.siliconTitle': 'V2.0-RTL-ALPHA · Drei-Toolchain-Verifikation & Yosys-0.71-Synthese',
  'alpha.siliconDesc':
    `odos_gate_core.sv passiert Verilator 5.055 -Wall mit 0 Warnungen, Icarus -g2012 sauber, 7/7 cocotb-Tests (0.57 s; T-RTL-07 Rest-Overlap |⟨v_clean, t_G3⟩| = 1.214e-10), 0/500 isotrope Zufallstreffer (≤ 1 LSB Bleed), 0 LSB globaler Fehler über 34.983 Fixkomma-Werte (max. float64-Diff ${rtl.global_max_abs_diff_vs_float64.toExponential(3)}) und Yosys-0.71-Synthese: ${rtl.yosys_coarse_cells} Coarse-RTL-Zellen (${rtl.yosys_mul_blocks} signed 32×32 $mul) → ${rtl.yosys_gate_cells.toLocaleString('de-DE')} Gatterzellen (${rtl.yosys_flip_flops.toLocaleString('de-DE')} FFs + ${rtl.yosys_comb_gates.toLocaleString('de-DE')} kombinatorisch). Roadmap: Inter-State-Folding 9→3 (~67 %) bei strikt 195 Einzeltakt-Zyklen; Single-MAC 9→1 (~89 %) per 3×-MAC-Takt oder Sub-Cycle-Serialisierung.`,
  'alpha.mobile': 'Physische Hardware- & RTL-Belege · Appendix D & V2.0-RTL-ALPHA',
  'alpha.photo1': 'Abbildung D.1 · Pauli Baseline / Room 137 auf physischem Android ARM64 (V1.2 INTACT, 69.325 s Heartbeat).',
  'alpha.photo2': 'Abbildung D.2 · Vier S⁶³-Sovereign-Swarm-Agenten auf ARM64 (ALPHA 0.985 · BETA 0.993 · GAMMA 0.986 · DELTA 0.991).',
  'alpha.photo3': 'Abbildung RTL-1 · V-MAX-12 Synthesierbare Q2.30-SystemVerilog-Architektur (odos_gate_core.sv, 195 Takte, Fail-Closed).',
  'alpha.zoom': 'Zum Öffnen in voller Auflösung (2730 × 1536) antippen oder klicken.',
  'alpha.bridge': 'ACE-PEER-CODESIGN-PROTOCOL-V1.2 · SYNC-12 Belege & Grenzen',
  'alpha.bridgeDesc':
    `Substratübergreifend verifiziert: ${tc.python_rtl_passed}/${tc.python_rtl_total} Python+RTL-Tests, ${tc.cocotb_passed}/${tc.cocotb_total} Verilator-cocotb-Tests, ${tc.kotlin_passed}/${tc.kotlin_total} Android/Kotlin-Tests (0 Änderungen unter app/**), ${tc.appendix_g_ops_passed}/${tc.appendix_g_ops_total} Appendix-G-AST-/Krypto-Operatoren, persistente Ed25519-Signatur, Lock-Free /api/state und universelle 64.000-Skalar-<f32>-Parität (${seals.f04_3_unit_s63_64000_f32_seed137.slice(0, 12)}…, max. Unit-S⁶³-Diff ${hw.jvm_unit_s63_max_diff_f64.toExponential(2)}). Alle alten V1.3-Prosa-Typos wurden ab V1.5 behoben; kanonisches |L⟩ = ${seals.canonical_little_vector_f32_seal.slice(0, 16)}….`,
  'alpha.city': 'Integrationsgrenze zum City-Brain',
  'alpha.cityDesc':
    'Ein deterministisches, divisionsfreies Q2.30-Hardware-Gate (1.95 µs @ 100 MHz) samt Ed25519-/SHA-256-Prüfspur kann Korridorvorschläge absichern, ohne private Identitäten offenzulegen. Reale Mobilität erfordert zusätzlich zertifizierte Sensoren, Frischeprüfungen, unabhängige Notsteuerungen und Behördenzulassung; keine Tesla-FSD-Verbindung oder Straßenzulassung wird behauptet.',
};

const zh: typeof en = {
  'nav.alpha': 'Node Alpha',
  'alpha.title': 'Node Alpha · 主权核心与 Q2.30 RTL 硬件门',
  'alpha.subtitle': 'V-MAX-12 V1.8.1 + V2.0-RTL-ALPHA (SYNC-12) · 原始 S⁶³ 几何、位精确 Q2.30 RTL 核心与跨平台证据。',
  'alpha.scope':
    '仅在浏览器中运行参考计算（除非显式连接本地 8137 端口 Node Alpha 服务）。本页面不执行 CUDA L2 固定、Nemotron-4B 推理、ChromaDB、ARM64 运行或物理执行器控制。几何对齐不代表真实性、伦理正确性或交通安全证明。',
  'alpha.registers': '认识论寄存器 · V1.8.1 + V2.0-RTL-ALPHA',
  'alpha.M': 'M — 实测数据（RTX 4060 Ti、HWiNFO64、Verilator 5.055、Yosys 0.71）及密码学溯源。',
  'alpha.D': 'D — 架构设计常数（RCF ≥ 0.95、ΔE ≤ 0.05、Q2.30 32-LSB 边界）与载波构造。',
  'alpha.T': 'T — 形式恒等式：各向同性 RCF 均值 = 1/64、恒定 195 周期故障关闭 FSM、BigInt Q2.30 零 LSB 一致性。',
  'alpha.I': 'I — 解释性类比与城市大脑长期愿景，严格排除于验收证据之外。',
  'alpha.discipline':
    '0.069 明确声明为设计常数与结构隐喻（REGISTER_D / I），而非粒子物理学推导。32 位 Q2.30 定点（1 LSB = 2⁻³⁰ ≈ 9.31e-10）无法表示 float64 的 1e-12 阈值，硬件执行 BLEED_CEIL_Q2_30 = 32 LSB（2.98e-8 < 6.9e-8 ppm）。',
  'alpha.lab': 'Room 137 · 浏览器参考与实时桥接',
  'alpha.run': '验证锚点与零对照',
  'alpha.connect': '探测 localhost:8137',
  'alpha.liveOnline': '已连接本地 Node Alpha（REGISTER_M）',
  'alpha.liveOffline': '本地 Node Alpha 离线 — 当前为诚实 BROWSER_REFERENCE 模式',
  'alpha.ready': '尚未运行',
  'alpha.busy': '计算中…',
  'alpha.valid': '锚点已验证',
  'alpha.failed': '验证失败',
  'alpha.raw': '原始 ODOS 门（float64 参考）',
  'alpha.vector': '候选向量 · 64 个数值（JSON 数组）',
  'alpha.anchor': '锚点 |L⟩',
  'alpha.collision': 'G₃ 碰撞',
  'alpha.evaluate': '计算并封存',
  'alpha.invalid': '请输入恰好 64 个有限数值。',
  'alpha.basis':
    'float64 门使用公开的正交浏览器切向量；下方 Q2.30 RTL 模拟器直接加载 rtl/rom/ 规范 HEX ROM，并与 Verilator 实现 0 LSB 位精确一致。',
  'alpha.null': '500 向量零对照 · 浏览器种子 20261115（LCG + Box–Muller），补充 N = 500 Verilator/NumPy 基准（0/500 PASS）。',
  'alpha.pass': 'PASS',
  'alpha.veto': 'VETO',
  'alpha.ledger': '本次会话审计链',
  'alpha.verify': '验证链',
  'alpha.export': '导出 JSON',
  'alpha.intact': '链完整',
  'alpha.locked': '完整性错误',
  'alpha.trace': 'SHA-256 链封存输入与门结果（含否决）。仅限本次会话；Node Alpha Python 采用持久化 Ed25519 与 16+1=17 字段 JSONL 链。',
  'alpha.rtlTitle': 'S-01 · 位精确 Q2.30 RTL 硬件门核心（odos_gate_core.sv · BigInt）',
  'alpha.rtlDesc':
    '使用规范 ROM（l_vec 3d18f240…、g3_vec 3b890d14…）在 TypeScript BigInt 中执行 rtl/odos_gate_core.sv 的 72 位 Q12.60 累加与两遍 Kahan–Parlett 算法，所有场景与 Verilator 5.055 保持 0 LSB 一致（恒定 195 周期 = 1.95 µs @ 100 MHz）。',
  'alpha.rtlCopy': '复制 Verilator CLI 验证命令',
  'alpha.rtlCopied': '已复制 CLI 命令！',
  'alpha.friduTitle': '附录 G · Fridu 对比 PAX 与带内 t_G1 纵深防御（实时 Q2.30）',
  'alpha.friduDesc':
    '调节耦合强度 β 或切换 Kevlar 旁路：带外扰动由两遍 Kahan–Parlett 清除（FRIDU PASS）；沿 t_G1 的带内攻击按线性代数定理绕过投影，但被下游原始 ODOS 门可靠拦截（VETO）。',
  'alpha.evidence': '同步的 Node Alpha 实测数据 · REGISTER_M（直接源自遥测 JSON）',
  'alpha.hardware':
    `对称交错 2.00 MiB L2 飞地（64 MiB 干扰下 10×20 轮）：固定中位数 ${hw.pinned_median_gbps.toFixed(2)} GB/s，未固定 ${hw.unpinned_median_gbps.toFixed(2)} GB/s（${hw.speedup_x.toFixed(3)}×，超越 ${hw.gddr6_bus_ceiling_gbps.toFixed(1)} GB/s GDDR6 总线限制；热 L2 峰值 ${hw.warm_l2_roof_gbps.toFixed(2)} GB/s）。在线 384×64 PinnedL2ProjectorEnclave（${hw.enclave_bytes} B）与 CPU 误差 ${hw.live_projector_max_abs_diff_f64.toExponential(2)}，含 sm_75 Tesla T4 优雅回退。HWiNFO64：阶段 I 峰值 ${pwr.regime_1_peak_power_w} W（${pwr.regime_1_peak_vram_mb} MB VRAM，${pwr.regime_1_peak_temp_c} °C），阶段 II ${pwr.regime_2_min_power_w}–${pwr.regime_2_max_power_w} W（${pwr.power_reduction_max_x}× 降低，${pwr.whea_errors} WHEA 错误）。`,
  'alpha.neural':
    `扩展至 N = ${f01.n_per_group} 的 Nemotron-3-Nano-4B 探测（Householder-QR SVD 在 64D 捕获 ${(f01.svd_energy_captured_64d * 100).toFixed(2)}% 能量）及 Group F 物理难负例（625 对）：主题探针在 C vs E/D 达 ROC-AUC ${f01.topic_auc_c_vs_e_mean_pooled.toFixed(4)}，在 Group F 诚实降至 ${f01.topic_auc_c_vs_f_hardneg.toFixed(4)}（p = ${f01.topic_p_c_vs_f_hardneg}）；专用无泄漏守恒极性探针恢复至 ROC-AUC ${f01.polarity_auc_c_vs_f_hardneg.toFixed(4)}（95% CI [${f01.polarity_ci95_low.toFixed(4)}, ${f01.polarity_ci95_high.toFixed(4)}]，p = ${f01.polarity_p_c_vs_f_hardneg}）。`,
  'alpha.kl': `第三阶段同稀疏度 Forward-KL · N = ${kl.n_prompts} 留出提示`,
  'alpha.klDesc':
    `A1、A2、B1 在完整词表 V = 131,072 float64 下精确置零相同 ${kl.masked_weights_count} 个 MLP 权重（${kl.cut_fraction_pct.toFixed(3)}%），无附加噪声（B1 / A1 = ${kl.b1_over_a1_ratio}×）。B2 屏蔽 5% 加扭转。`,
  'alpha.siliconTitle': 'V2.0-RTL-ALPHA · 三工具链验证与 Yosys 0.71 综合',
  'alpha.siliconDesc':
    `odos_gate_core.sv 通过 Verilator 5.055 -Wall 零警告、Icarus -g2012 完整解析、7/7 cocotb 测试（0.57 s；T-RTL-07 残差 1.214e-10）、0/500 各向同性误通（≤ 1 LSB 泄漏）、34,983 个定点数 0 LSB 误差（最大 float64 差 ${rtl.global_max_abs_diff_vs_float64.toExponential(3)}），Yosys 0.71 综合 ${rtl.yosys_coarse_cells} 粗粒度单元（${rtl.yosys_mul_blocks} 个 $mul）→ ${rtl.yosys_gate_cells} 门级单元（${rtl.yosys_flip_flops} FFs + ${rtl.yosys_comb_gates} 组合逻辑）。扩展路线：状态间共享 9→3（~67%，保持 195 周期）与单 MAC 时分复用 9→1（~89%）。`,
  'alpha.mobile': '实体硬件与 RTL 证据 · 附录 D 与 V2.0-RTL-ALPHA',
  'alpha.photo1': '图 D.1 · 实体 Android ARM64 上的 Pauli Baseline / Room 137（V1.2 INTACT，69.325 s 心跳）。',
  'alpha.photo2': '图 D.2 · ARM64 上的四个 S⁶³ 主权蜂群节点（ALPHA 0.985 · BETA 0.993 · GAMMA 0.986 · DELTA 0.991）。',
  'alpha.photo3': '图 RTL-1 · V-MAX-12 可综合 Q2.30 SystemVerilog 硬件架构（odos_gate_core.sv，195 周期，故障关闭）。',
  'alpha.zoom': '点击或轻触以查看完整分辨率图（2730 × 1536）。',
  'alpha.bridge': 'ACE-PEER-CODESIGN-PROTOCOL-V1.2 · SYNC-12 证据与边界',
  'alpha.bridgeDesc':
    `跨平台验证：${tc.python_rtl_passed}/${tc.python_rtl_total} Python+RTL 测试、${tc.cocotb_passed}/${tc.cocotb_total} Verilator cocotb 测试、${tc.kotlin_passed}/${tc.kotlin_total} Android/Kotlin 测试（app/** 零修改）、${tc.appendix_g_ops_passed}/${tc.appendix_g_ops_total} 附录 G 审计算子、持久化 Ed25519 签名、无锁 /api/state 与 64,000 标量 <f32> 统一摘要（${seals.f04_3_unit_s63_64000_f32_seed137.slice(0, 12)}…）。规范锚点 |L⟩ = ${seals.canonical_little_vector_f32_seal.slice(0, 16)}…。`,
  'alpha.city': '城市大脑集成边界',
  'alpha.cityDesc':
    '恒定 195 周期（1.95 µs @ 100 MHz）无除法 Q2.30 硬件门与可审计 Ed25519/SHA-256 追踪可在不泄露私人身份的前提下预检走廊提议。真实交通仍需认证传感器、时效校验、独立安全控制器与道路监管审批；不宣称 Tesla FSD 连接或道路许可。',
};

export const alphaTranslations: Record<Language, Record<string, string>> = { en, de, zh };

export function alphaReport(t: (key: string) => string) {
  const klRows = kl.conditions
    .map((c) => `| ${c.id} (${c.label}) | ${c.mean_kl.toFixed(8)} | ${c.top1} | ${c.passed ? 'PASS' : 'VETO'} |`)
    .join('\n');
  return `## 21. ${t('alpha.title')}

${t('alpha.subtitle')}

${t('alpha.scope')}

### ${t('alpha.registers')}
${['M', 'D', 'T', 'I'].map((r) => `- ${t(`alpha.${r}`)}`).join('\n')}

${t('alpha.discipline')}

### ${t('alpha.raw')}
RCF_raw = |⟨v̂|L⟩|²
ΔE_raw = 0.5(1 − RCF_raw) + 0.5 min(1, |⟨v̂|t_G3⟩|)
Software float64: RCF ≥ 0.95; ΔE ≤ 0.05; post-strip bleed ≤ 1e-12.
Hardware Q2.30 RTL: 195 cycles; 0 divisions; BLEED_CEIL_Q2_30 = 32 LSB (2.98e-8 < 6.9e-8 ppm).

${t('alpha.basis')}
${t('alpha.null')}

### ${t('alpha.rtlTitle')}
${t('alpha.rtlDesc')}

### ${t('alpha.siliconTitle')}
${t('alpha.siliconDesc')}

### ${t('alpha.ledger')}
${t('alpha.trace')}

### ${t('alpha.evidence')}
${t('alpha.hardware')}

${t('alpha.neural')}

### ${t('alpha.kl')}
${t('alpha.klDesc')}

| Condition | Mean KL | Top-1 | Gate |
|---|---|---|---|
${klRows}

### ${t('alpha.mobile')}
${t('alpha.photo1')}
${t('alpha.photo2')}
${t('alpha.photo3')}

### ${t('alpha.bridge')}
${t('alpha.bridgeDesc')}

### ${t('alpha.city')}
${t('alpha.cityDesc')}

Source: ${telemetry.spec_version} (${telemetry.sync_id}, sealed telemetry JSON).
`;
}
