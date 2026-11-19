import type { Language } from './i18n';

const en = {
  // S-02 · Quantum City-Brain Corridor & Q2.30 ODOS Gate Simulator
  's02.title': 'S-02 · Live Quantum City-Brain Corridor & Bit-Exact Q2.30 ODOS Gate Simulator',
  's02.desc':
    'Every ground pod, 120 m air-taxi and 240 m express drone streams its 64D corridor proposal through our bit-exact Q2.30 BigInt RTL core (odos_gate_core.sv, canonical ROMs l_vec & g3_vec). Inject real physical/adversarial faults below to watch fail-closed hardware vetoes divert compromised agents in real time.',
  's02.disclaimer':
    'Model Demonstrator (REGISTER_D / T): executes real Q2.30 RTL math in the browser; does not represent physical vehicle control, Tesla FSD linkage or ATC certification.',
  's02.play': 'Play',
  's02.pause': 'Pause',
  's02.step': 'Step +1',
  's02.reset': 'Reset',
  's02.mode.nominal': 'Nominal Flow (PASS)',
  's02.mode.g3_spoof': 'G₃ Spoofing Attack (VETO)',
  's02.mode.in_band_tg1': 'In-Band t_G1 Drift (VETO)',
  's02.mode.norm_fault': 'Unnormalized Packet (Norm Fault)',
  's02.severity': 'Perturbation Severity',
  's02.inspectAgent': 'Inspected Agent',
  's02.copyCli': 'Copy Agent Verilator CLI',
  's02.copiedCli': 'Copied CLI!',
  's02.layer2': 'LAYER 2 · 240 m EXPRESS DRONES',
  's02.layer1': 'LAYER 1 · 120 m AIR-TAXI CORRIDOR',
  's02.layer0': 'LAYER 0 · GROUND AUTONOMOUS LANES',
  's02.chartTitle': 'Live Corridor Q2.30 Gate Telemetry (Mean RCF vs. Max ΔE_raw)',

  // S-03 · Kuramoto & Two-Pass Kahan–Parlett Storm Simulator
  's03.title': 'S-03 · Live Kuramoto Phase-Sync & Two-Pass Kahan–Parlett Storm Simulator',
  's03.desc':
    'Simulates N = 24 Cybercab/Drone swarm oscillators driven by the real Q2.30 ODOS gate under storm coupling β. Compare the shielded FRIDU swarm (Two-Pass Kahan–Parlett stripping) against the unshielded PAX swarm — or flip bypass_kevlar ON to prove that removing the shield collapses FRIDU immediately.',
  's03.beta': 'Storm Coupling β',
  's03.couplingK': 'Kuramoto Coupling K',
  's03.wheelFridu': 'FRIDU Shielded Phases',
  's03.wheelBypass': 'FRIDU (BYPASS ON)',
  's03.wheelPax': 'PAX Unshielded Phases',
  's03.chartOrder': 'Kuramoto Phase Order Parameter r(t) — FRIDU vs. PAX',
  's03.chartRcf': 'Q2.30 Hardware Gate RCF_raw & ΔE_raw Trajectory',

  // S-04 · RTX 4060 Ti L2 Roofline & Silicon Throughput Calculator
  's04.title': 'S-04 · RTX 4060 Ti L2-SRAM Roofline (REGISTER_M) & odos_gate_core.sv Silicon Scaling (REGISTER_T)',
  's04.desc':
    'Left: real symmetric interleaved 2.00 MiB L2 enclave measurements on RTX 4060 Ti (499.30 vs. 269.54 GB/s = 1.852×, surpassing the 288 GB/s GDDR6 bus; warm L2 roof 838.49 GB/s). Right: analytical throughput & fleet capacity calculator for our Yosys-0.71-synthesized 195-cycle Q2.30 RTL gate core.',
  's04.rooflineTitle': 'Empirical RTX 4060 Ti L2 Enclave Roofline (GB/s · REGISTER_M)',
  's04.scalingTitle': 'Silicon Throughput vs. Fleet Demand (kDecisions/s · REGISTER_T)',
  's04.stage.stage1_baseline': 'Stage 1 · Verified Baseline (9 $mul · 89,609 gates)',
  's04.stage.stage2_folded_9to3': 'Stage 2 · Inter-State Folding (9→3 $mul · −67%)',
  's04.stage.stage3_single_mac_9to1': 'Stage 3 · Single-MAC 3× Clock (9→1 $mul · −89%)',
  's04.clock': 'RTL Clock Frequency',
  's04.cores': 'Parallel Gate Cores',
  's04.fleet': 'City-Brain Fleet Vehicles',
  's04.cadence': 'Gate Cadence per Vehicle',
  's04.supported': 'CAPACITY MET · Hardware Headroom',
  's04.overloaded': 'CAPACITY EXCEEDED · Add Parallel Cores or Higher Clock',
};

const de: typeof en = {
  // S-02 · Quantum City-Brain Corridor & Q2.30 ODOS Gate Simulator
  's02.title': 'S-02 · Live Quantum City-Brain Korridor- & Bit-exakter Q2.30-ODOS-Gate-Simulator',
  's02.desc':
    'Jeder Boden-Pod, jedes 120-m-Lufttaxi und jede 240-m-Expressdrohne schleust ihren 64D-Korridorvorschlag live durch unseren bit-exakten Q2.30-BigInt-RTL-Kern (odos_gate_core.sv, kanonische ROMs l_vec & g3_vec). Injiziere unten reale Störungen, um harte Fail-Closed-Vetos und sofortige Ausweichmanöver in Echtzeit zu beobachten.',
  's02.disclaimer':
    'Modell-Demonstrator (REGISTER_D / T): rechnet echte Q2.30-RTL-Mathematik im Browser; keine physische Fahrzeugsteuerung, keine Tesla-FSD-Kopplung und keine Flugsicherungs-Zulassung.',
  's02.play': 'Start',
  's02.pause': 'Pause',
  's02.step': 'Takt +1',
  's02.reset': 'Reset',
  's02.mode.nominal': 'Normalbetrieb (PASS)',
  's02.mode.g3_spoof': 'G₃-Spoofing-Angriff (VETO)',
  's02.mode.in_band_tg1': 'In-Band-t_G1-Drift (VETO)',
  's02.mode.norm_fault': 'Unnormiertes Paket (Norm Fault)',
  's02.severity': 'Störungsstärke',
  's02.inspectAgent': 'Inspizierter Agent',
  's02.copyCli': 'Verilator-CLI für Agent kopieren',
  's02.copiedCli': 'CLI kopiert!',
  's02.layer2': 'EBENE 2 · 240 m EXPRESSDROHNEN',
  's02.layer1': 'EBENE 1 · 120 m LUFTTAXI-KORRIDOR',
  's02.layer0': 'EBENE 0 · AUTONOME BODENSPUREN',
  's02.chartTitle': 'Live-Korridor Q2.30-Gate-Telemetrie (Ø RCF vs. Max. ΔE_raw)',

  // S-03 · Kuramoto & Two-Pass Kahan–Parlett Storm Simulator
  's03.title': 'S-03 · Live Kuramoto-Phasensynchronisations- & Two-Pass-Kahan–Parlett-Sturmsimulator',
  's03.desc':
    'Simuliert N = 24 Cybercab-/Drohnen-Schwarmoszillatoren gekoppelt an das echte Q2.30-ODOS-Gate unter Sturmlast β. Vergleiche den geschirmten FRIDU-Schwarm (Two-Pass-Kahan–Parlett) gegen den ungeschirmten PAX-Schwarm — oder schalte bypass_kevlar ein, um den sofortigen Kollaps im Negativkontroll-Test zu beweisen.',
  's03.beta': 'Sturm-Kopplung β',
  's03.couplingK': 'Kuramoto-Kopplung K',
  's03.wheelFridu': 'FRIDU-Phasen (geschirmt)',
  's03.wheelBypass': 'FRIDU (BYPASS AN)',
  's03.wheelPax': 'PAX-Phasen (ungeschirmt)',
  's03.chartOrder': 'Kuramoto-Ordnungsparameter r(t) — FRIDU vs. PAX',
  's03.chartRcf': 'Q2.30-Hardware-Gate RCF_raw & ΔE_raw Verlauf',

  // S-04 · RTX 4060 Ti L2 Roofline & Silicon Throughput Calculator
  's04.title': 'S-04 · RTX-4060-Ti L2-SRAM-Roofline (REGISTER_M) & odos_gate_core.sv Silizium-Rechner (REGISTER_T)',
  's04.desc':
    'Links: real gemessene symmetrisch verschachtelte 2.00-MiB-L2-Enklave auf RTX 4060 Ti (499,30 vs. 269,54 GB/s = 1,852×, über dem 288-GB/s-GDDR6-Buslimit; Warm-L2-Dach 838,49 GB/s). Rechts: analytischer Durchsatz- & Flottenrechner für unseren Yosys-0.71-synthetisierten 195-Takt-Q2.30-RTL-Kern.',
  's04.rooflineTitle': 'Empirische RTX-4060-Ti L2-Roofline (GB/s · REGISTER_M)',
  's04.scalingTitle': 'Silizium-Durchsatz vs. Flottenbedarf (kEntscheidungen/s · REGISTER_T)',
  's04.stage.stage1_baseline': 'Stage 1 · Verifizierte Baseline (9 $mul · 89.609 Gatter)',
  's04.stage.stage2_folded_9to3': 'Stage 2 · Inter-State-Folding (9→3 $mul · −67 %)',
  's04.stage.stage3_single_mac_9to1': 'Stage 3 · Single-MAC 3× Takt (9→1 $mul · −89 %)',
  's04.clock': 'RTL-Taktfrequenz',
  's04.cores': 'Parallele Gate-Kerne',
  's04.fleet': 'City-Brain-Flottengröße',
  's04.cadence': 'Gate-Rate pro Fahrzeug',
  's04.supported': 'KAPAZITÄT ERFÜLLT · Hardware-Reserve',
  's04.overloaded': 'KAPAZITÄT ÜBERSCHRITTEN · Mehr Kerne oder höheren Takt wählen',
};

const zh: typeof en = {
  // S-02 · Quantum City-Brain Corridor & Q2.30 ODOS Gate Simulator
  's02.title': 'S-02 · 量子城市大脑实时多层走廊与位精确 Q2.30 ODOS 门仿真器',
  's02.desc':
    '每辆地面无人车、120 米空中出租车与 240 米快递无人机均实时通过位精确 Q2.30 BigInt RTL 核心（odos_gate_core.sv，规范 ROM l_vec 与 g3_vec）校验 64 维走廊提议。点击下方故障注入按钮，观察故障关闭硬件否决与实时安全改道。',
  's02.disclaimer':
    '模型演示器（REGISTER_D / T）：在浏览器中运行真实 Q2.30 RTL 数学，不代表实车控制、Tesla FSD 连接或空管认证。',
  's02.play': '运行',
  's02.pause': '暂停',
  's02.step': '单步 +1',
  's02.reset': '重置',
  's02.mode.nominal': '正常通行（PASS）',
  's02.mode.g3_spoof': 'G₃ 欺骗注入（VETO）',
  's02.mode.in_band_tg1': '带内 t_G1 漂移（VETO）',
  's02.mode.norm_fault': '未归一化传感器包（Norm Fault）',
  's02.severity': '扰动强度',
  's02.inspectAgent': '当前检视节点',
  's02.copyCli': '复制该节点 Verilator CLI 命令',
  's02.copiedCli': '已复制 CLI！',
  's02.layer2': '第 2 层 · 240 m 高速无人机走廊',
  's02.layer1': '第 1 层 · 120 m 空中出租车走廊',
  's02.layer0': '第 0 层 · 地面自动驾驶车道',
  's02.chartTitle': '实时走廊 Q2.30 门遥测（平均 RCF 对比最大 ΔE_raw）',

  // S-03 · Kuramoto & Two-Pass Kahan–Parlett Storm Simulator
  's03.title': 'S-03 · 实时 Kuramoto 相位同步与两遍 Kahan–Parlett 风暴仿真器',
  's03.desc':
    '在风暴耦合负载 β 下仿真 N = 24 蜂群振子并耦合真实 Q2.30 ODOS 门。对比屏蔽态 FRIDU 蜂群与未屏蔽 PAX 蜂群——或开启 bypass_kevlar 负对照验证屏蔽失效后的瞬间崩塌。',
  's03.beta': '风暴耦合强度 β',
  's03.couplingK': 'Kuramoto 耦合常数 K',
  's03.wheelFridu': 'FRIDU 相位轮（已屏蔽）',
  's03.wheelBypass': 'FRIDU（旁路开启）',
  's03.wheelPax': 'PAX 相位轮（未屏蔽）',
  's03.chartOrder': 'Kuramoto 相位序参量 r(t) — FRIDU 对比 PAX',
  's03.chartRcf': 'Q2.30 硬件门 RCF_raw 与 ΔE_raw 演化曲线',

  // S-04 · RTX 4060 Ti L2 Roofline & Silicon Throughput Calculator
  's04.title': 'S-04 · RTX 4060 Ti L2-SRAM 屋顶线（REGISTER_M）与 odos_gate_core.sv 硅片吞吐计算器（REGISTER_T）',
  's04.desc':
    '左：RTX 4060 Ti 对称交错 2.00 MiB L2 飞地实测带宽（499.30 vs 269.54 GB/s = 1.852×，超越 288 GB/s GDDR6 总线；热 L2 峰值 838.49 GB/s）。右：基于 Yosys 0.71 综合的 195 周期 Q2.30 RTL 门核心解析吞吐与车队容量计算器。',
  's04.rooflineTitle': 'RTX 4060 Ti L2 飞地实测带宽（GB/s · REGISTER_M）',
  's04.scalingTitle': '硅片吞吐对比车队需求（千次决策/秒 · REGISTER_T）',
  's04.stage.stage1_baseline': 'Stage 1 · 已验证基线（9 $mul · 89,609 门）',
  's04.stage.stage2_folded_9to3': 'Stage 2 · 状态间共享（9→3 $mul · −67%）',
  's04.stage.stage3_single_mac_9to1': 'Stage 3 · 单 MAC 3× 时钟（9→1 $mul · −89%）',
  's04.clock': 'RTL 时钟频率',
  's04.cores': '并行硬件门核心数',
  's04.fleet': '城市大脑车队规模',
  's04.cadence': '单车门控频率',
  's04.supported': '容量满足 · 硬件裕量',
  's04.overloaded': '超出容量 · 请增加并行核心或提高主频',
};

export const phase2Translations: Record<Language, Record<string, string>> = { en, de, zh };
