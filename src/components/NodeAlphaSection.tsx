import { useMemo, useState } from 'react';
import {
  Play,
  ShieldCheck,
  Download,
  ScanLine,
  Cpu,
  Copy,
  Check,
  Radio,
  ShieldAlert,
  Cloud,
  ExternalLink,
  FileCode2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import {
  deriveAnchor,
  browserTangent,
  evaluateRawGate,
  runNullControl,
  appendAudit,
  verifyAudit,
  passesKl,
  fetchNodeAlphaLiveState,
} from '@/lib/node-alpha';
import type { GateResult, AuditEntry, NodeAlphaLiveHudState } from '@/lib/node-alpha';
import {
  buildCrossSubstrateProofPack,
  evalOdosQ230,
  evaluateFriduDefenseInDepthQ230,
  formatVerilatorEmulatorCommand,
  Q2_30_CONSTANTS,
  vecToQ230,
} from '@/lib/odos-q2-30';
import RtlVcdWaveformViewer from '@/components/RtlVcdWaveformViewer';
import telemetry from '@/data/node-alpha-telemetry.json';
import baseline from '@/assets/node-alpha-mobile-baseline.asset.json';
import swarm from '@/assets/node-alpha-mobile-swarm.asset.json';
import verilogArch from '@/assets/node-alpha-verilog-architecture.asset.json';

const GITHUB_RAW_IMG = 'https://raw.githubusercontent.com/NathaliaLietuvaite/Quantenkommunikation/main/assets/images';

type RtlPresetKey = 'canonical_l' | 'pure_g3_attack' | 'zero_vector' | 'scaled_half_l_vector';

const RTL_PRESET_LABELS: Record<RtlPresetKey, string> = {
  canonical_l: '1. Canonical |L⟩ (PASS)',
  pure_g3_attack: '2. Pure G₃ Attack (VETO)',
  zero_vector: '3a. Zero Vector (Norm Fault)',
  scaled_half_l_vector: '3b. 0.5·|L⟩ Scaled (Norm Fault)',
};

const NodeAlphaSection = () => {
  const { t } = useI18n();
  const [anchor, setAnchor] = useState<Awaited<ReturnType<typeof deriveAnchor>> | null>(null);
  const [control, setControl] = useState<ReturnType<typeof runNullControl> | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GateResult | null>(null);
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [integrity, setIntegrity] = useState<boolean | null>(null);

  // Live Node Alpha Bridge probe (localhost:8137)
  const [liveHud, setLiveHud] = useState<NodeAlphaLiveHudState | null>(null);
  const [probingLive, setProbingLive] = useState(false);

  // S-01: Q2.30 BigInt RTL Hardware Simulator state
  const [rtlPreset, setRtlPreset] = useState<RtlPresetKey>('canonical_l');
  const [copiedCli, setCopiedCli] = useState(false);

  // Appendix G: Fridu vs. PAX vs. In-Band t_G1 Defense-in-Depth controls
  const [friduBeta, setFriduBeta] = useState(0.35);
  const [bypassKevlar, setBypassKevlar] = useState(false);

  const lRom = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
  const g3Rom = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;

  const rtlPresetVecQ = useMemo(() => {
    if (rtlPreset === 'canonical_l') return lRom;
    if (rtlPreset === 'pure_g3_attack') return g3Rom;
    if (rtlPreset === 'zero_vector') return new Array<number>(64).fill(0);
    return vecToQ230(lRom.map((q) => (q / Q2_30_CONSTANTS.ONE_Q2_30) * 0.5));
  }, [rtlPreset, lRom, g3Rom]);

  const rtlEval = useMemo(() => evalOdosQ230(rtlPresetVecQ, lRom, g3Rom), [rtlPresetVecQ, lRom, g3Rom]);

  const verilatorExpected = telemetry.rtl_v20_alpha.scenarios[rtlPreset];
  const rtlMaxLsbDiffVsVerilator = Math.max(
    Math.abs(rtlEval.normSqQ - verilatorExpected.norm_sq_q),
    Math.abs(rtlEval.rcfRawQ - verilatorExpected.rcf_raw_q),
    Math.abs(rtlEval.g3OverlapQ - verilatorExpected.g3_overlap_q),
    Math.abs(rtlEval.deltaERawQ - verilatorExpected.delta_e_raw_q),
    Math.abs(rtlEval.bleedPostQ - verilatorExpected.bleed_post_q),
  );

  const friduAb = useMemo(
    () => evaluateFriduDefenseInDepthQ230(lRom, g3Rom, friduBeta, bypassKevlar),
    [lRom, g3Rom, friduBeta, bypassKevlar],
  );

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      const next = await deriveAnchor();
      if (!next.matches) throw new Error('Anchor mismatch');
      setAnchor(next);
      setInput(JSON.stringify(next.vector));
      setControl(runNullControl(next.vector, browserTangent(next.vector)));
    } catch {
      setError(t('alpha.failed'));
    } finally {
      setBusy(false);
    }
  };

  const probeLocalNodeAlpha = async () => {
    setProbingLive(true);
    const state = await fetchNodeAlphaLiveState('http://127.0.0.1:8137');
    setLiveHud(state);
    setProbingLive(false);
  };

  const evaluate = async () => {
    if (!anchor || integrity === false) return;
    setBusy(true);
    setError('');
    try {
      const vector: unknown = JSON.parse(input);
      if (
        !Array.isArray(vector) ||
        vector.length !== 64 ||
        vector.some((v) => typeof v !== 'number' || !Number.isFinite(v))
      ) {
        setError(t('alpha.invalid'));
        return;
      }
      const gate = evaluateRawGate(vector, anchor.vector, browserTangent(anchor.vector));
      const next = await appendAudit(entries, vector, gate);
      setResult(gate);
      setEntries(next);
      setIntegrity(true);
    } catch {
      setError(t('alpha.invalid'));
    } finally {
      setBusy(false);
    }
  };

  const copyVerilatorCli = async () => {
    const cmd = formatVerilatorEmulatorCommand(rtlPresetVecQ);
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 1800);
    } catch {
      setCopiedCli(false);
    }
  };

  const downloadProofPack = () => {
    const pack = buildCrossSubstrateProofPack(rtlPreset, rtlPresetVecQ, rtlEval, {
      syncId: telemetry.sync_id,
      lRomSha256: telemetry.golden_seals.l_vec_q2_30_hex_sha256,
      g3RomSha256: telemetry.golden_seals.g3_vec_q2_30_hex_sha256,
      rtlReportSha256: telemetry.golden_seals.rtl_odos_gate_emulator_report_sha256,
    });
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(pack, null, 2) + '\n'], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `vmax12-rtl-proof-pack-${rtlPreset}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const download = () => {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              schema: 'NODE_ALPHA_BROWSER_V1',
              syncId: telemetry.sync_id,
              anchorSeal: anchor?.seal,
              entries,
            },
            null,
            2,
          ),
        ],
        { type: 'application/json' },
      ),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'node-alpha-browser-audit.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const evidenceImages = [
    {
      primary: baseline.url,
      fallback: `${GITHUB_RAW_IMG}/V-MAX-12-APP-NOV01.jpg`,
      key: 'alpha.photo1',
      dims: '2569 × 1186',
    },
    {
      primary: swarm.url,
      fallback: `${GITHUB_RAW_IMG}/V-MAX-12-APP-NOV02.jpg`,
      key: 'alpha.photo2',
      dims: '2612 × 1206',
    },
    {
      primary: verilogArch.url,
      fallback: `${GITHUB_RAW_IMG}/V-MAX-12-Verilog.png`,
      key: 'alpha.photo3',
      dims: '2730 × 1536',
    },
  ];

  return (
    <div className="node-alpha space-y-8 text-foreground">
      <header className="text-center space-y-4">
        <p className="font-mono text-xs text-primary">
          PQMS / NODE ALPHA / V4.0-GDSII + V4.2-COREWARE ({telemetry.sync_id})
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('alpha.title')}</h2>
        <p className="text-lg">{t('alpha.subtitle')}</p>
      </header>

      <p className="border-l-4 border-primary bg-background/90 p-5 leading-relaxed">{t('alpha.scope')}</p>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">{t('alpha.registers')}</h3>
        <div className="grid gap-3 md:grid-cols-4">
          {['M', 'D', 'T', 'I'].map((r) => (
            <div key={r} className="rounded-lg border bg-card p-4 text-sm leading-relaxed">
              {t(`alpha.${r}`)}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{t('alpha.discipline')}</p>
      </section>

      {/* S-01: Bit-Exact Q2.30 Hardware RTL Gate Simulator (BigInt, 0 LSB vs Verilator) */}
      <section className="rounded-lg border border-cyan-500/40 bg-background/95 p-5 md:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-semibold text-primary">{t('alpha.rtlTitle')}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={copyVerilatorCli}>
              {copiedCli ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {t(copiedCli ? 'alpha.rtlCopied' : 'alpha.rtlCopy')}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadProofPack}>
              <Download className="w-4 h-4 mr-1" />
              {t('mc.proofPackBtn')}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('alpha.rtlDesc')}</p>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(RTL_PRESET_LABELS) as RtlPresetKey[]).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={rtlPreset === key ? 'default' : 'secondary'}
              onClick={() => setRtlPreset(key)}
            >
              {RTL_PRESET_LABELS[key]}
            </Button>
          ))}
        </div>

        {/* 7-Stage Constant-Time 195-Cycle FSM Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {rtlEval.fsmStages.map((st) => (
            <div
              key={st.state}
              className={`rounded-md border p-3 font-mono text-xs space-y-1 ${
                st.state === 'S_VERDICT'
                  ? st.gatePass
                    ? 'border-emerald-400/60 bg-emerald-950/40'
                    : 'border-rose-400/60 bg-rose-950/40'
                  : 'border-amber-400/30 bg-slate-900/70'
              }`}
            >
              <div className="font-semibold text-cyan-200">{st.state}</div>
              <div className="text-muted-foreground">
                +{st.cycles} cyc (Σ {st.cumulativeCycles})
              </div>
              <div className={st.vetoPin ? 'text-rose-300' : 'text-emerald-300'}>
                veto_pin_o = {st.vetoPin ? '1 (LOCK)' : '0 (OPEN)'}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 rounded-lg border bg-card p-4 font-mono text-xs">
          <div className="space-y-1">
            <div>
              verdict:{' '}
              <strong className={rtlEval.gatePass ? 'text-emerald-400' : 'text-rose-400'}>
                {rtlEval.gatePass ? 'PASS (gate_pass_o=1)' : 'VETO (veto_pin_o=1)'}
              </strong>{' '}
              · cycles = {rtlEval.cycleCount} (1.95 µs @ 100 MHz)
            </div>
            <div>
              norm_sq_q = {rtlEval.normSqQ} · norm_fault = {String(rtlEval.normFault)} · pure_g3 ={' '}
              {String(rtlEval.pureG3Collision)}
            </div>
            <div>
              rcf_raw = {rtlEval.rcfRawFloat.toFixed(9)} (Q={rtlEval.rcfRawQ})
            </div>
            <div>
              delta_e_raw = {rtlEval.deltaERawFloat.toFixed(9)} (Q={rtlEval.deltaERawQ})
            </div>
            <div>
              bleed_post = {rtlEval.bleedPostQ} LSB ({rtlEval.bleedPostFloat.toExponential(3)})
            </div>
          </div>
          <div className="space-y-1 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
            <div className="text-cyan-300 font-semibold">
              Cross-Substrate Parity vs. Compiled Verilator 5.055:
            </div>
            <div>
              max_lsb_diff_vs_verilator:{' '}
              <strong className={rtlMaxLsbDiffVsVerilator === 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {rtlMaxLsbDiffVsVerilator} LSB
              </strong>
            </div>
            <div>l_vec_q2_30.hex SHA-256: {telemetry.golden_seals.l_vec_q2_30_hex_sha256.slice(0, 20)}…</div>
            <div>g3_vec_q2_30.hex SHA-256: {telemetry.golden_seals.g3_vec_q2_30_hex_sha256.slice(0, 20)}…</div>
            <div>
              rtl_report_seal: {telemetry.golden_seals.rtl_odos_gate_emulator_report_sha256.slice(0, 20)}…
            </div>
          </div>
        </div>
      </section>

      {/* Real Verilator 5.055 Hardware VCD Logic Analyzer (REGISTER_M) */}
      <RtlVcdWaveformViewer />

      {/* Appendix G Interactive Fridu vs PAX vs In-Band t_G1 Defense-in-Depth (Live Q2.30) */}
      <section className="rounded-lg border bg-background/95 p-5 md:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-primary">{t('alpha.friduTitle')}</h3>
          </div>
          <Button
            size="sm"
            variant={bypassKevlar ? 'destructive' : 'secondary'}
            onClick={() => setBypassKevlar((prev) => !prev)}
          >
            bypass_kevlar = {String(bypassKevlar)}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('alpha.friduDesc')}</p>

        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="fridu-beta" className="font-mono text-sm">
            Coupling β = <strong>{friduBeta.toFixed(2)}</strong>
          </label>
          <input
            id="fridu-beta"
            type="range"
            min={0}
            max={0.8}
            step={0.01}
            value={friduBeta}
            onChange={(e) => setFriduBeta(Number(e.target.value))}
            className="w-64 accent-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
          {[
            { name: '0. Base Core |ψ_core⟩', res: friduAb.baseGate, sub: 'Unperturbed reference' },
            { name: '1. PAX Unshielded', res: friduAb.paxGate, sub: 'Out-of-band direct mix' },
            {
              name: bypassKevlar ? '2. FRIDU (BYPASS ON)' : '2. FRIDU Shielded',
              res: friduAb.friduGate,
              sub: bypassKevlar ? 'Negative control active' : '2-Pass Kahan–Parlett',
            },
            {
              name: '3. In-Band t_G1 Attack',
              res: friduAb.inBandTg1Gate,
              sub: 'Bypasses strip → ODOS gate',
            },
          ].map((item) => (
            <div key={item.name} className="rounded-lg border bg-card p-3 space-y-1">
              <div className="font-semibold text-cyan-200">{item.name}</div>
              <div className="text-muted-foreground">{item.sub}</div>
              <div>RCF = {item.res.rcfRawFloat.toFixed(6)}</div>
              <div>ΔE = {item.res.deltaERawFloat.toFixed(6)}</div>
              <div>Bleed = {item.res.bleedPostQ} LSB</div>
              <div className={item.res.gatePass ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {item.res.gatePass ? 'PASS' : 'ODOS VETO'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Room 137 Browser Reference + Optional Local Node Alpha Port 8137 Probe */}
      <section className="rounded-lg border bg-background/95 p-5 md:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-primary">{t('alpha.lab')}</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={probeLocalNodeAlpha} disabled={probingLive}>
              <Radio className="w-4 h-4 mr-1" />
              {t('alpha.connect')}
            </Button>
            <Button onClick={run} disabled={busy}>
              <Play className="w-4 h-4 mr-1" />
              {t(busy ? 'alpha.busy' : 'alpha.run')}
            </Button>
          </div>
        </div>

        {liveHud && (
          <div
            role="status"
            className={`rounded-md border p-3 font-mono text-xs ${
              liveHud.reachable
                ? 'border-emerald-400/50 bg-emerald-950/30 text-emerald-200'
                : 'border-amber-400/40 bg-amber-950/20 text-amber-200'
            }`}
          >
            {liveHud.reachable ? (
              <div>
                <strong>{t('alpha.liveOnline')}</strong> · {liveHud.aceProtocolId} · Ed25519=
                {String(liveHud.ed25519Verified)} · L2_Live={String(liveHud.pinnedL2Live)} · LockFree=
                {String(liveHud.lockFreeSnapshot)} · GPU={liveHud.gpuTempC ?? '?'}°C / {liveHud.gpuPowerW ?? '?'}W (
                {liveHud.telemetrySource ?? 'N/A'})
              </div>
            ) : (
              <div>
                {t('alpha.liveOffline')} ({liveHud.url}: {liveHud.error})
              </div>
            )}
          </div>
        )}

        <div role="status" className="font-mono text-sm break-all">
          {t(anchor ? 'alpha.valid' : 'alpha.ready')}
          {anchor && <p className="mt-2">SHA-256 · {anchor.seal}</p>}
        </div>

        {control && (
          <div className="border-y py-4 space-y-2">
            <p className="text-sm text-muted-foreground">{t('alpha.null')}</p>
            <p className="font-mono">
              {control.passed} / {control.count} PASS · mean RCF {control.meanRcf.toFixed(6)} · 1/64 = 0.015625
            </p>
          </div>
        )}

        <h4 className="font-semibold">{t('alpha.raw')}</h4>
        <p className="font-mono text-sm break-words">
          ΔE_raw = 0.5(1 − RCF_raw) + 0.5 min(1, G₃ overlap)
          <br />
          RCF ≥ 0.95 · ΔE ≤ 0.05 · bleed_post ≤ 10⁻¹²
        </p>
        <p className="text-sm text-muted-foreground">{t('alpha.basis')}</p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={!anchor || busy}
            onClick={() => anchor && setInput(JSON.stringify(anchor.vector))}
          >
            {t('alpha.anchor')}
          </Button>
          <Button
            variant="secondary"
            disabled={!anchor || busy}
            onClick={() => anchor && setInput(JSON.stringify(browserTangent(anchor.vector)))}
          >
            {t('alpha.collision')}
          </Button>
        </div>
        <label className="block text-sm" htmlFor="alpha-vector">
          {t('alpha.vector')}
        </label>
        <textarea
          id="alpha-vector"
          className="w-full h-32 rounded-md border bg-card p-3 font-mono text-xs text-foreground focus-visible:outline-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
        <Button onClick={evaluate} disabled={!anchor || busy || integrity === false}>
          <ScanLine className="w-4 h-4 mr-1" />
          {t('alpha.evaluate')}
        </Button>
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        {result && (
          <div role="status" className="border rounded-lg p-4 space-y-2">
            <strong className={result.passed ? 'text-primary' : 'text-destructive'}>
              {t(result.passed ? 'alpha.pass' : 'alpha.veto')}
            </strong>
            <p className="font-mono text-sm break-words">
              RCF_raw {result.rcfRaw.toFixed(6)} · ΔE_raw {result.deltaERaw.toFixed(6)} · G₃{' '}
              {result.collision.toFixed(6)} · bleed_post {result.bleedPost.toExponential(2)}
            </p>
          </div>
        )}
        <div className="border-t pt-5 space-y-3">
          <h4 className="font-semibold">
            {t('alpha.ledger')} · {entries.length}
          </h4>
          <p className="text-sm text-muted-foreground">{t('alpha.trace')}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={!entries.length || busy}
              onClick={async () => setIntegrity(await verifyAudit(entries))}
            >
              <ShieldCheck className="w-4 h-4 mr-1" />
              {t('alpha.verify')}
            </Button>
            <Button variant="secondary" disabled={!entries.length || busy} onClick={download}>
              <Download className="w-4 h-4 mr-1" />
              {t('alpha.export')}
            </Button>
          </div>
          {integrity !== null && <p role="status">{t(integrity ? 'alpha.intact' : 'alpha.locked')}</p>}
          {entries.length > 0 && (
            <p className="font-mono text-xs break-all">SHA-256 · {entries[entries.length - 1]?.seal}</p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">{t('alpha.evidence')}</h3>
        <p className="leading-relaxed">{t('alpha.hardware')}</p>
        <p className="leading-relaxed">{t('alpha.neural')}</p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">{t('alpha.kl')}</h3>
        <p className="text-sm text-muted-foreground">{t('alpha.klDesc')}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {telemetry.stage3_kl_n25.conditions.map((cond) => (
            <div key={cond.id} className="border rounded-lg bg-card p-4 space-y-2">
              <strong>{cond.id}</strong>
              <p className="text-xs text-muted-foreground">{cond.label}</p>
              <p className="font-mono text-sm">{cond.mean_kl.toFixed(8)}</p>
              <p className="font-mono text-xs text-muted-foreground">Top-1: {cond.top1}</p>
              <p className={passesKl(cond.mean_kl) ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {t(passesKl(cond.mean_kl) ? 'alpha.pass' : 'alpha.veto')}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-primary">{t('alpha.siliconTitle')}</h3>
        <p className="leading-relaxed">{t('alpha.siliconDesc')}</p>
      </section>

      {/* [MOD-142] Portable Cloud Verification · Google Colab (SYNC-22) */}
      <section className="rounded-lg border border-emerald-500/35 bg-background/95 p-5 md:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-emerald-400 shrink-0" />
            <h3 className="text-xl font-semibold text-primary">{t('alpha.colabTitle')}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" asChild>
              <a href={telemetry.colab_mod142_portable_rtl.colab_url} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                {t('alpha.colabOpen')}
              </a>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <a href={telemetry.colab_mod142_portable_rtl.github_url} target="_blank" rel="noreferrer">
                <FileCode2 className="w-4 h-4 mr-1" />
                {t('alpha.colabSource')}
              </a>
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('alpha.colabDesc')}</p>

        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="font-semibold text-sm text-emerald-300">{t(`alpha.colabCard${idx}Title`)}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{t(`alpha.colabCard${idx}Desc`)}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border bg-card/70 px-4 py-3 font-mono text-xs text-muted-foreground break-all space-y-1">
          <div>
            notebook_sha256 ({telemetry.colab_mod142_portable_rtl.notebook_filename}):{' '}
            <span className="text-emerald-300">{telemetry.golden_seals.colab_mod142_notebook_sha256}</span>
          </div>
          <div>
            portable_policy: {telemetry.colab_mod142_portable_rtl.portable_tests_executed_without_eda}/
            {telemetry.colab_mod142_portable_rtl.portable_tests_total} PASS · skipped=
            {telemetry.colab_mod142_portable_rtl.portable_tests_skipped_without_eda} (@unittest.skipUnless) ·
            checksums={telemetry.colab_mod142_portable_rtl.golden_checksums_verified}/
            {telemetry.colab_mod142_portable_rtl.golden_checksums_verified} MATCH · iso_null=
            {telemetry.colab_mod142_portable_rtl.isotropic_null_passes}/
            {telemetry.colab_mod142_portable_rtl.isotropic_null_controls} (≤{' '}
            {telemetry.colab_mod142_portable_rtl.isotropic_max_bleed_lsb} LSB)
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">{t('alpha.mobile')}</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {evidenceImages.map((img) => (
            <figure key={img.key} className="space-y-3">
              <a href={img.primary} target="_blank" rel="noreferrer">
                <img
                  src={img.primary}
                  alt={t(img.key)}
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.src !== img.fallback) {
                      el.src = img.fallback;
                    }
                  }}
                  className="w-full h-[380px] object-contain bg-background rounded-lg border"
                />
              </a>
              <figcaption className="text-sm text-muted-foreground">
                {t(img.key)}
                <span className="mt-1 block font-mono text-xs text-cyan-300">
                  {t('alpha.zoom')} ({img.dims})
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-primary">{t('alpha.bridge')}</h3>
        <p className="leading-relaxed">{t('alpha.bridgeDesc')}</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-primary">{t('alpha.city')}</h3>
        <p className="leading-relaxed">{t('alpha.cityDesc')}</p>
      </section>
    </div>
  );
};

export default NodeAlphaSection;
