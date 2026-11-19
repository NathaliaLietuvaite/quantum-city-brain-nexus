import type { Language } from './i18n';

const en = {
  // Hero Mission Control CTAs
  'mc.hero.launchLab': 'Launch Mission Control · Live Q2.30 RTL Lab',
  'mc.hero.openVcd': 'Inspect Verilator 5.055 VCD Trace',
  'mc.hero.openOverview': 'Concept Overview',

  // Mission Control Shell
  'mc.badge': 'PQMS / V-MAX-12 · MISSION CONTROL',
  'mc.title': 'Quantum City-Brain · Executable Mission Control',
  'mc.subtitle':
    'Structured 3-sector command deck replacing the 21-tab wall: jump straight into live Q2.30 silicon simulation, inspect sealed REGISTER_M measurements, or explore the full PQMS vision without losing a single module.',
  'mc.showAll': 'All 21 Modules',
  'mc.showSector': 'Sector View',
  'mc.liveBadge': 'LIVE',
  'mc.nextBadge': 'ROADMAP',
  'mc.telemetry.sync': 'SYNC-12 Sealed',
  'mc.telemetry.rtl': 'Q2.30 RTL · 195 cyc · 0 LSB',
  'mc.telemetry.l2': 'L2 Enclave · 499.30 GB/s (1.852×)',
  'mc.telemetry.tests': 'Tests · 47 Py · 7 cocotb · 24 Kt · 9/9 Colab',

  // 3 Sectors
  'mc.sector.labs.title': 'Live Demonstrator & Labs',
  'mc.sector.labs.sub': 'Bit-exact Q2.30 RTL core, VCD logic analyzer & upcoming interactive simulators',
  'mc.sector.evidence.title': 'Hardware Evidence & Governance',
  'mc.sector.evidence.sub': 'Measured silicon benchmarks, KL/F-01 probes, HWiNFO64 power & ODOS layers',
  'mc.sector.vision.title': 'PQMS Theory & Vision Archive',
  'mc.sector.vision.sub': 'Complete conceptual architecture, Ghost protocol, DMC, BrainLink & MSE',

  // Epistemic Truth Lens
  'mc.lens.toggle': 'Truth Lens',
  'mc.lens.on': 'ON',
  'mc.lens.off': 'OFF',
  'mc.lens.bannerTitle': 'Epistemic Truth Lens Active · Scientific Provenance Filter',
  'mc.lens.bannerDesc':
    'Color-coded boundaries separate empirical silicon/model measurements (M), design constants (D), mathematical identities (T), and conceptual vision (I). Click any register below to highlight matching modules.',
  'mc.lens.filterAll': 'All (21)',
  'mc.lens.activeStage.M': 'Active module contains REGISTER_M empirical telemetry (backed by sealed hashes & hardware/model runs).',
  'mc.lens.activeStage.T': 'Active module is REGISTER_T analytical / deterministic model — browser math or formal architecture, not physical hardware certification.',
  'mc.lens.activeStage.D': 'Active module specifies REGISTER_D design constants & engineering thresholds.',
  'mc.lens.activeStage.I': 'Active module is REGISTER_I conceptual vision / interpretive metaphor — strictly excluded from engineering acceptance proofs.',

  // VCD Waveform Viewer (Real Verilator 5.055 traces)
  'vcd.title': 'Real Verilator 5.055 Hardware Timing Waveform (odos_gate_core.sv · REGISTER_M)',
  'vcd.desc':
    'Extracted cycle-for-cycle directly from compiled Verilator 5.055 VCD dumps (odos_gate_canonical_l.vcd & odos_gate_g3_veto.vcd). Scrub any clock cycle to prove fail-closed timing: veto_pin_o stays asserted (1) across every compute cycle 0..196 and releases only at latch cycle 197 iff gate_pass_o == 1.',
  'vcd.tracePass': 'Canonical |L⟩ · PASS (195 cyc)',
  'vcd.traceVeto': 'Pure G₃ Attack · VETO (195 cyc)',
  'vcd.zoomFull': 'Full 0–197',
  'vcd.zoomEntry': 'Entry 0–72',
  'vcd.zoomVerdict': 'Verdict Edge 175–197',
  'vcd.probeCycle': 'Cursor Cycle',
  'vcd.failClosedOk': 'FAIL-CLOSED VERIFIED · veto_pin_o released ONLY on verified PASS at cycle 197',
  'vcd.failClosedHold': 'FAIL-CLOSED LOCKED · veto_pin_o remains HIGH (1) across all 198 cycles with zero glitches',

  // Proof Pack Export
  'mc.proofPackBtn': 'Export Proof Pack JSON',
};

const de: typeof en = {
  // Hero Mission Control CTAs
  'mc.hero.launchLab': 'Mission Control starten · Live Q2.30-RTL-Labor',
  'mc.hero.openVcd': 'Echten Verilator-5.055-VCD-Trace prüfen',
  'mc.hero.openOverview': 'Konzept-Überblick',

  // Mission Control Shell
  'mc.badge': 'PQMS / V-MAX-12 · MISSION CONTROL',
  'mc.title': 'Quantum City-Brain · Ausführbare Leitstelle (Mission Control)',
  'mc.subtitle':
    'Strukturierte 3-Sektoren-Leitstelle statt 21-Tab-Wand: Direkt in die bit-exakte Q2.30-Silizium-Simulation springen, versiegelte REGISTER_M-Messwerte prüfen oder die vollständige PQMS-Vision erkunden — kein einziger Reiter geht verloren.',
  'mc.showAll': 'Alle 21 Module',
  'mc.showSector': 'Sektor-Ansicht',
  'mc.liveBadge': 'LIVE',
  'mc.nextBadge': 'ROADMAP',
  'mc.telemetry.sync': 'SYNC-12 Versiegelt',
  'mc.telemetry.rtl': 'Q2.30 RTL · 195 Takte · 0 LSB',
  'mc.telemetry.l2': 'L2-Enklave · 499,30 GB/s (1,852×)',
  'mc.telemetry.tests': 'Tests · 47 Py · 7 cocotb · 24 Kt · 9/9 Colab',

  // 3 Sectors
  'mc.sector.labs.title': 'Live-Demonstrator & Labore',
  'mc.sector.labs.sub': 'Bit-exakter Q2.30-RTL-Kern, VCD-Logikanalysator & kommende Simulatoren',
  'mc.sector.evidence.title': 'Hardware-Beweise & Governance',
  'mc.sector.evidence.sub': 'Empirische Silizium-Benchmarks, F-01/KL-Sonden, HWiNFO64 & ODOS-Schichten',
  'mc.sector.vision.title': 'PQMS-Theorie & Visions-Archiv',
  'mc.sector.vision.sub': 'Vollständige Konzeptarchitektur, Ghost-Protokoll, DMC, BrainLink & MSE',

  // Epistemic Truth Lens
  'mc.lens.toggle': 'Truth Lens',
  'mc.lens.on': 'AN',
  'mc.lens.off': 'AUS',
  'mc.lens.bannerTitle': 'Epistemic Truth Lens aktiv · Wissenschaftlicher Herkunfts-Filter',
  'mc.lens.bannerDesc':
    'Farbcodierte Rahmen trennen empirische Hardware-/Modell-Messungen (M), Designkonstanten (D), mathematische Identitäten (T) und Langfrist-Visionen (I). Klicke ein Register an, um passende Module hervorzuheben.',
  'mc.lens.filterAll': 'Alle (21)',
  'mc.lens.activeStage.M': 'Aktives Modul enthält empirische REGISTER_M-Messwerte (durch versiegelte Hashes & reale Hardware-/Modellläufe belegt).',
  'mc.lens.activeStage.T': 'Aktives Modul ist ein analytisches/deterministisches REGISTER_T-Modell — Mathematik im Browser oder formale Architektur, keine reale Hardware-Zertifizierung.',
  'mc.lens.activeStage.D': 'Aktives Modul definiert REGISTER_D-Designkonstanten und Ingenieurs-Schwellenwerte.',
  'mc.lens.activeStage.I': 'Aktives Modul ist REGISTER_I-Konzeptvision / Metapher — strikt von technischen Abnahmebelegen getrennt.',

  // VCD Waveform Viewer (Real Verilator 5.055 traces)
  'vcd.title': 'Echtes Verilator-5.055-Hardware-Timing-Diagramm (odos_gate_core.sv · REGISTER_M)',
  'vcd.desc':
    'Taktgenau extrahiert aus real kompilierten Verilator-5.055-VCD-Traces (odos_gate_canonical_l.vcd & odos_gate_g3_veto.vcd). Bewege den Cursor über jeden Taktzyklus als Fail-Closed-Beweis: veto_pin_o bleibt über alle Rechentakte 0..196 aktiv (1) und öffnet erst im Latch-Takt 197 genau dann, wenn gate_pass_o == 1.',
  'vcd.tracePass': 'Kanonisch |L⟩ · PASS (195 Takte)',
  'vcd.traceVeto': 'Reiner G₃-Angriff · VETO (195 Takte)',
  'vcd.zoomFull': 'Gesamt 0–197',
  'vcd.zoomEntry': 'Eintritt 0–72',
  'vcd.zoomVerdict': 'Verdict-Flanke 175–197',
  'vcd.probeCycle': 'Cursor-Takt',
  'vcd.failClosedOk': 'FAIL-CLOSED BESTÄTIGT · veto_pin_o fällt NUR bei verifiziertem PASS in Takt 197 auf 0',
  'vcd.failClosedHold': 'FAIL-CLOSED VERRIEGELT · veto_pin_o bleibt über alle 198 Takte glitchfrei auf HIGH (1)',

  // Proof Pack Export
  'mc.proofPackBtn': 'Proof-Pack JSON exportieren',
};

const zh: typeof en = {
  // Hero Mission Control CTAs
  'mc.hero.launchLab': '启动任务控制中心 · 实时 Q2.30 RTL 实验室',
  'mc.hero.openVcd': '查看 Verilator 5.055 实测 VCD 波形',
  'mc.hero.openOverview': '概念总览',

  // Mission Control Shell
  'mc.badge': 'PQMS / V-MAX-12 · 任务控制中心',
  'mc.title': '量子城市大脑 · 可执行任务控制中心（Mission Control）',
  'mc.subtitle':
    '以清晰的三分区指挥台取代 21 标签墙：一键进入位精确 Q2.30 硅片仿真、查验封存的 REGISTER_M 实测证据，或浏览完整 PQMS 架构愿景——全部 21 个模块完整保留。',
  'mc.showAll': '全部 21 模块',
  'mc.showSector': '分区视图',
  'mc.liveBadge': '实时运行',
  'mc.nextBadge': '路线图',
  'mc.telemetry.sync': 'SYNC-12 已封签',
  'mc.telemetry.rtl': 'Q2.30 RTL · 195 周期 · 0 LSB',
  'mc.telemetry.l2': 'L2 飞地 · 499.30 GB/s (1.852×)',
  'mc.telemetry.tests': '测试 · 47 Py · 7 cocotb · 24 Kt · 9/9 Colab',

  // 3 Sectors
  'mc.sector.labs.title': '实时演示与硅片实验室',
  'mc.sector.labs.sub': '位精确 Q2.30 RTL 核心、VCD 逻辑分析仪及后续交互仿真器',
  'mc.sector.evidence.title': '硬件实测证据与治理',
  'mc.sector.evidence.sub': '实测芯片基准、F-01/KL 探测、HWiNFO64 功耗与 ODOS 治理层',
  'mc.sector.vision.title': 'PQMS 理论与愿景档案',
  'mc.sector.vision.sub': '完整概念架构、幽灵协议、DMC、BrainLink 与 MSE',

  // Epistemic Truth Lens
  'mc.lens.toggle': '真值透镜',
  'mc.lens.on': '开',
  'mc.lens.off': '关',
  'mc.lens.bannerTitle': '认识论真值透镜已开启 · 科学溯源过滤器',
  'mc.lens.bannerDesc':
    '按颜色区分实测硬件/模型数据（M）、设计常数（D）、数学恒等式（T）与长期概念愿景（I）。点击任意寄存器标签以高亮对应模块。',
  'mc.lens.filterAll': '全部 (21)',
  'mc.lens.activeStage.M': '当前模块包含 REGISTER_M 实测遥测（具密码学封签与真实硬件/模型运行记录）。',
  'mc.lens.activeStage.T': '当前模块为 REGISTER_T 形式分析或浏览器确定性模型，不代表物理硬件道路认证。',
  'mc.lens.activeStage.D': '当前模块定义 REGISTER_D 架构设计常数与工程阈值。',
  'mc.lens.activeStage.I': '当前模块属于 REGISTER_I 概念愿景/隐喻，严格排除于工程验收证据之外。',

  // VCD Waveform Viewer (Real Verilator 5.055 traces)
  'vcd.title': '真实 Verilator 5.055 硬件时序波形（odos_gate_core.sv · REGISTER_M）',
  'vcd.desc':
    '逐周期直接提取自已编译的 Verilator 5.055 VCD 文件（odos_gate_canonical_l.vcd 与 odos_gate_g3_veto.vcd）。拖动光标检查每个时钟周期以验证故障关闭时序：veto_pin_o 在全部计算周期 0..196 保持拉高（1），仅在周期 197 锁存且 gate_pass_o == 1 时释放。',
  'vcd.tracePass': '规范 |L⟩ · PASS（195 周期）',
  'vcd.traceVeto': '纯 G₃ 攻击 · VETO（195 周期）',
  'vcd.zoomFull': '全程 0–197',
  'vcd.zoomEntry': '载入段 0–72',
  'vcd.zoomVerdict': '裁决沿 175–197',
  'vcd.probeCycle': '光标周期',
  'vcd.failClosedOk': '故障关闭已验证 · veto_pin_o 仅在周期 197 确认 PASS 后释放为 0',
  'vcd.failClosedHold': '故障关闭锁定 · veto_pin_o 在全部 198 个周期内零毛刺保持 HIGH（1）',

  // Proof Pack Export
  'mc.proofPackBtn': '导出 Proof-Pack JSON',
};

export const missionControlTranslations: Record<Language, Record<string, string>> = { en, de, zh };
