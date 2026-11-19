import type { Language } from './i18n';

const en = {
  // S-05 · F-01 Hard-Negative ROC & Stage-3 KL Explorer
  's05.title': 'S-05 · Empirical F-01 Hard-Negative ROC & Stage-3 KL Explorer (N = 25 · REGISTER_M)',
  's05.desc':
    'Computed live in the browser directly on the 100 real held-out Nemotron-3-Nano-4B scores from VMAX_F01_NEMOTRON_PROBE.json (Groups C, D, E, F; N = 25 each) and VMAX_STAGE3_REAL_KL_REPORT.json. Slide the decision threshold τ to inspect exact TPR/FPR and witness honest Topic-Probe confounding on Group F (AUC 0.6304) vs. Polarity-Probe recovery (AUC 0.7648).',
  's05.pair.ce': 'Topic Probe · C vs. E Fluent (AUC 1.0000)',
  's05.pair.cd': 'Topic Probe · C vs. D Scrambled (AUC 1.0000)',
  's05.pair.cf_topic': 'Topic Probe · C vs. F Hard-Neg (Honest Collapse · 0.6304)',
  's05.pair.cf_pol': 'Polarity Probe · C vs. F Hard-Neg (Recovery · 0.7648)',
  's05.threshold': 'Decision Threshold τ',
  's05.rocTitle': 'Exact Empirical ROC Curve (N = 25 vs. N = 25 · 625 Pairs)',
  's05.klTitle': 'Stage-3 Matched-Sparsity Forward-KL Gate Sweep (N = 25 · B1/A1 = 111.47×)',
  's05.klSlider': 'KL Divergence Gate Ceiling',

  // S-06 · HWiNFO64 Empirical Fleet Energy & Economics Simulator
  's06.title': 'S-06 · HWiNFO64 Empirical Power Regimes (REGISTER_M) & City-Brain Fleet Energy Calculator (REGISTER_D)',
  's06.desc':
    'Anchors directly to real out-of-band HWiNFO64 RTX 4060 Ti measurements (Regime I peak 85.78 W vs. Regime II steady-state S⁶³ sanctuary 9.57 W = 8.96× reduction, 0 WHEA errors) and separates measured silicon wattage (M) from adjustable municipal deployment assumptions (D).',
  's06.nodes': 'Edge / Intersection Nodes',
  's06.hours': 'Operating Hours / Day',
  's06.price': 'Electricity Price (€/kWh)',
  's06.offload': 'Local Gate Triage Share (Regime II)',
  's06.chartTitle': '5-Year Cumulative Electricity Cost Comparison (k€)',

  // S-07 · Ghost 4-Mode State Machine + Heartbeat & Thermal Guard
  's07.title': 'S-07 · Live Ghost Protocol 4-Mode Automaton · 69.325 s Heartbeat & 65.0 °C Thermal Guard',
  's07.desc':
    'Interactive finite-state machine coupled to the real Node Alpha constants (HEARTBEAT_PERIOD_SEC = 69.324849 s, THERMAL_GUARD = 65.0 °C, 60 s cooldown pause). Identity migration is gated in real time by evalOdosQ230(); inject a 67.5 °C thermal fault to watch the hardware safety pause lock out unsafe transitions.',
  's07.ping': '1. Resonance Ping → Listening',
  's07.activate': '2. Corridor Demand → Activation',
  's07.migratePass': '3a. Migrate (Canonical |L⟩ · PASS)',
  's07.migrateVeto': '3b. Migrate (G₃ Spoof · ODOS VETO)',
  's07.fault': 'Inject 67.5 °C Thermal Fault',
  's07.dormancy': 'Return Dormancy',
  's07.step10': 'Advance +10 s',
  's07.chartTitle': 'Live GPU Temperature (°C) vs. 65.0 °C Hardware Guard Limit',
};

const de: typeof en = {
  // S-05 · F-01 Hard-Negative ROC & Stage-3 KL Explorer
  's05.title': 'S-05 · Empirischer F-01 Hard-Negative-ROC- & Stage-3-KL-Explorer (N = 25 · REGISTER_M)',
  's05.desc':
    'Rechnet live im Browser auf den 100 real gemessenen Nemotron-3-Nano-4B-Werten aus VMAX_F01_NEMOTRON_PROBE.json (Gruppen C, D, E, F; je N = 25) und VMAX_STAGE3_REAL_KL_REPORT.json. Verschiebe die Schwelle τ für exakte TPR/FPR und vergleiche den ehrlichen Topic-Probe-Kollaps bei Group F (AUC 0,6304) mit der Polarity-Probe-Erholung (AUC 0,7648).',
  's05.pair.ce': 'Topic-Sonde · C vs. E Fluent (AUC 1,0000)',
  's05.pair.cd': 'Topic-Sonde · C vs. D Scrambled (AUC 1,0000)',
  's05.pair.cf_topic': 'Topic-Sonde · C vs. F Hard-Neg (Ehrlicher Kollaps · 0,6304)',
  's05.pair.cf_pol': 'Polarity-Sonde · C vs. F Hard-Neg (Erholung · 0,7648)',
  's05.threshold': 'Entscheidungsschwelle τ',
  's05.rocTitle': 'Exakte empirische ROC-Kurve (N = 25 vs. N = 25 · 625 Paare)',
  's05.klTitle': 'Stage-3 Forward-KL-Gate-Sweep bei gleicher Sparsität (N = 25 · B1/A1 = 111,47×)',
  's05.klSlider': 'KL-Divergenz-Schwellenwert',

  // S-06 · HWiNFO64 Empirical Fleet Energy & Economics Simulator
  's06.title': 'S-06 · Empirische HWiNFO64-Leistungsregime (REGISTER_M) & Flotten-Energie-Rechner (REGISTER_D)',
  's06.desc':
    'Verankert direkt an den realen Out-of-Band-HWiNFO64-Messungen der RTX 4060 Ti (Regime I Spitze 85,78 W vs. Regime II S⁶³-Sanctuary 9,57 W = 8,96× Reduktion, 0 WHEA-Fehler) und trennt strikt gemessene Hardware-Watt (M) von einstellbaren Stadt-Szenario-Reglern (D).',
  's06.nodes': 'Edge- / Kreuzungsknoten',
  's06.hours': 'Betriebsstunden / Tag',
  's06.price': 'Strompreis (€/kWh)',
  's06.offload': 'Lokaler Gate-Triage-Anteil (Regime II)',
  's06.chartTitle': 'Kumulierte 5-Jahres-Stromkosten im Vergleich (k€)',

  // S-07 · Ghost 4-Mode State Machine + Heartbeat & Thermal Guard
  's07.title': 'S-07 · Live Ghost-Protokoll 4-Modi-Zustandsautomat · 69,325-s-Heartbeat & 65,0-°C-Thermoschutz',
  's07.desc':
    'Interaktiver Zustandsautomat gekoppelt an die echten Node-Alpha-Konstanten (HEARTBEAT_PERIOD_SEC = 69,324849 s, THERMAL_GUARD = 65,0 °C, 60 s Schutzpause). Jede Identitäts-Migration wird live durch evalOdosQ230() geprüft; ein 67,5-°C-Thermofehler löst sofort die Schutzverriegelung aus.',
  's07.ping': '1. Resonanz-Ping → Listening',
  's07.activate': '2. Korridor-Bedarf → Activation',
  's07.migratePass': '3a. Migration (Kanonisch |L⟩ · PASS)',
  's07.migrateVeto': '3b. Migration (G₃-Spoof · ODOS VETO)',
  's07.fault': '67,5 °C Thermofehler injizieren',
  's07.dormancy': 'Zurück in Dormancy',
  's07.step10': '+10 s vorrücken',
  's07.chartTitle': 'Live-GPU-Temperatur (°C) vs. 65,0 °C Hardware-Schutzgrenze',
};

const zh: typeof en = {
  // S-05 · F-01 Hard-Negative ROC & Stage-3 KL Explorer
  's05.title': 'S-05 · 实测 F-01 难负例 ROC 与第三阶段 KL 探索器（N = 25 · REGISTER_M）',
  's05.desc':
    '直接在浏览器中基于 VMAX_F01_NEMOTRON_PROBE.json 的 100 组真实 Nemotron-3-Nano-4B 留出得分（C/D/E/F 组各 25 例）与 VMAX_STAGE3_REAL_KL_REPORT.json 实时计算。拖动阈值 τ 查看精确 TPR/FPR 与 Group F 主题探针诚实坍塌（AUC 0.6304）对比极性探针恢复（AUC 0.7648）。',
  's05.pair.ce': '主题探针 · C vs E 流畅文本（AUC 1.0000）',
  's05.pair.cd': '主题探针 · C vs D 随机噪声（AUC 1.0000）',
  's05.pair.cf_topic': '主题探针 · C vs F 难负例（诚实坍塌 · 0.6304）',
  's05.pair.cf_pol': '守恒极性探针 · C vs F 难负例（恢复 · 0.7648）',
  's05.threshold': '判定阈值 τ',
  's05.rocTitle': '精确经验 ROC 曲线（N = 25 vs N = 25 · 625 对）',
  's05.klTitle': '第三阶段同稀疏度 Forward-KL 门控扫描（N = 25 · B1/A1 = 111.47×）',
  's05.klSlider': 'KL 散度门控上限',

  // S-06 · HWiNFO64 Empirical Fleet Energy & Economics Simulator
  's06.title': 'S-06 · HWiNFO64 实测功耗状态（REGISTER_M）与车队能耗经济计算器（REGISTER_D）',
  's06.desc':
    '直接锚定 RTX 4060 Ti 真实带外 HWiNFO64 实测（阶段 I 峰值 85.78 W 对比阶段 II 稳态 S⁶³ 9.57 W = 8.96× 降耗，0 WHEA 错误），严格区分实测硬件功耗（M）与城市部署情景参数（D）。',
  's06.nodes': '边缘 / 路口节点数',
  's06.hours': '每日运行小时',
  's06.price': '电价（€/kWh）',
  's06.offload': '本地硬件门分流比例（阶段 II）',
  's06.chartTitle': '5 年累计电费成本对比（千欧元 k€）',

  // S-07 · Ghost 4-Mode State Machine + Heartbeat & Thermal Guard
  's07.title': 'S-07 · 幽灵协议四态自动机 · 69.325 s 心跳与 65.0 °C 热保护仿真器',
  's07.desc':
    '直接耦合 Node Alpha 真实常数（心跳周期 69.324849 s、热保护阈值 65.0 °C、60 s 冷却暂停）。每次身份迁移均由 evalOdosQ230() 实时裁决；注入 67.5 °C 热故障可立即验证硬件保护锁定。',
  's07.ping': '1. 共振脉冲 → Listening',
  's07.activate': '2. 走廊调度 → Activation',
  's07.migratePass': '3a. 迁移（规范 |L⟩ · PASS）',
  's07.migrateVeto': '3b. 迁移（G₃ 攻击 · ODOS VETO）',
  's07.fault': '注入 67.5 °C 热故障',
  's07.dormancy': '返回休眠 Dormancy',
  's07.step10': '推进 +10 s',
  's07.chartTitle': '实时 GPU 温度（°C）对比 65.0 °C 硬件热保护红线',
};

export const phase3Translations: Record<Language, Record<string, string>> = { en, de, zh };
