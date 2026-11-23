import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Brain,
  Thermometer,
  CheckCircle2,
  Cpu,
  Lock,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface QuarantineLogEntry {
  id: string;
  epoch: number;
  bank: 'BANK_A' | 'BANK_B';
  reason: string;
  rcf: number;
  digest: string;
}

const V46DolphinPauseControl = () => {
  const { lang } = useI18n();
  const isDe = lang === 'de';

  const [epoch, setEpoch] = useState<number>(1);
  const [activeBank, setActiveBank] = useState<'BANK_A' | 'BANK_B'>('BANK_A');
  const [hbmTempC, setHbmTempC] = useState<number>(65);
  const [epistemicPause, setEpistemicPause] = useState<boolean>(false);
  const [passthroughCount, setPassthroughCount] = useState<number>(18);
  const [pauseCount, setPauseCount] = useState<number>(0);
  const [thermalDeferred, setThermalDeferred] = useState<boolean>(false);
  const [lastHandoverStatus, setLastHandoverStatus] = useState<string>('LOCKSTEP_DMR_VERIFIED');
  const [syncRoot, setSyncRoot] = useState<string>('add791bc4f80');
  const [friduMessage, setFriduMessage] = useState<string>(
    isDe
      ? 'Unihemisphärisches Delphin-Gate aktiv: BANK_A (AWAKE_GATE) schützt Live-Eingänge, BANK_B (DOLPHIN_SWEEP) konsolidiert ohne Downtime (0 MB GPU-VRAM).'
      : 'Unihemispheric Dolphin Gate active: BANK_A (AWAKE_GATE) guards live ingress while BANK_B (DOLPHIN_SWEEP) consolidates with zero downtime (0 MB GPU VRAM).'
  );
  const [quarantineLog, setQuarantineLog] = useState<QuarantineLogEntry[]>([]);

  const restingBank: 'BANK_A' | 'BANK_B' = activeBank === 'BANK_A' ? 'BANK_B' : 'BANK_A';

  const makeDigest = (seed: number) =>
    ((seed * 2654435761) >>> 0).toString(16).padStart(8, '0') + 'e4f7';

  const handleCoherentCommand = () => {
    setEpistemicPause(false);
    setThermalDeferred(false);
    setPassthroughCount((c) => c + 1);
    setLastHandoverStatus('NOT_REQUIRED');
    setFriduMessage(
      isDe
        ? `Kohärenter Stadt-Befehl (C_dir = 0.9983 >= 0.68): blockierungsfreier Durchlass an Nemotron-3-Nano-4B über ${activeBank} (0 MB VRAM-Delta).`
        : `Coherent city command (C_dir = 0.9983 >= 0.68): zero-blocking pass-through to Nemotron-3-Nano-4B on ${activeBank} (0 MB VRAM delta).`
    );
  };

  const handleEpistemicPause = (mode: 'CONTRADICTION' | 'DRIFT') => {
    const nextBank: 'BANK_A' | 'BANK_B' = restingBank;
    const nextEpoch = epoch + 1;
    const recId = mode === 'CONTRADICTION' ? `city_contra_ep${nextEpoch}` : `city_drift_ep${nextEpoch}`;
    const rcf = mode === 'CONTRADICTION' ? -0.412 : 0.1201;
    const reason =
      mode === 'CONTRADICTION' ? 'SEALED_ANCHOR_CONTRADICTION_PAUSE' : 'ODOS_PROMPT_DRIFT_PAUSE';
    const digest = makeDigest(nextEpoch * 137 + (mode === 'CONTRADICTION' ? 7 : 3));

    setQuarantineLog((prev) => [
      { id: recId, epoch, bank: activeBank, reason, rcf, digest },
      ...prev.slice(0, 4),
    ]);
    setActiveBank(nextBank);
    setEpoch(nextEpoch);
    setSyncRoot(digest);
    setEpistemicPause(true);
    setThermalDeferred(hbmTempC >= 82);
    setPauseCount((c) => c + 1);
    setLastHandoverStatus('LOCKSTEP_DMR_VERIFIED');
    setFriduMessage(
      isDe
        ? `Epistemische Pause (0,896 ms): Widersprüchliche Prämisse (${recId}) append-only in T_I/O isoliert — kein halluzinierter Kompromiss. Hemisphäre atomar auf ${nextBank} gewechselt (Epoch ${nextEpoch}).`
        : `Epistemic pause (0.896 ms): conflicting premise (${recId}) isolated append-only into T_I/O without forced compromise. Hemisphere switched atomically to ${nextBank} (epoch ${nextEpoch}).`
    );
  };

  const handleHemisphereSwitch = () => {
    const nextBank: 'BANK_A' | 'BANK_B' = restingBank;
    const nextEpoch = epoch + 1;
    const deferred = hbmTempC >= 82;
    const digest = makeDigest(nextEpoch * 313 + hbmTempC);

    setActiveBank(nextBank);
    setEpoch(nextEpoch);
    setSyncRoot(digest);
    setEpistemicPause(false);
    setThermalDeferred(deferred);
    setLastHandoverStatus('LOCKSTEP_DMR_VERIFIED');
    setFriduMessage(
      deferred
        ? isDe
          ? `Stage-6-Thermik-Guard (${hbmTempC} °C >= 82 °C): Slow-Wave-Sweep sauber vertagt (thermal_deferred = true, 0 Datenverlust). Aktive Bank: ${nextBank}.`
          : `Stage-6 thermal guard (${hbmTempC} C >= 82 C): slow-wave sweep cleanly deferred (thermal_deferred = true, 0 data loss). Active bank: ${nextBank}.`
        : isDe
          ? `Atomarer LOCKSTEP_DMR_BRIDGE-Wechsel in 0,764 ms: ${activeBank} geht in DOLPHIN_SWEEP, ${nextBank} übernimmt AWAKE_GATE (Merkle-Roots identisch: ${digest}).`
          : `Atomic LOCKSTEP_DMR_BRIDGE switch in 0.764 ms: ${activeBank} enters DOLPHIN_SWEEP while ${nextBank} assumes AWAKE_GATE (Merkle roots identical: ${digest}).`
    );
  };

  return (
    <Card
      id="v46-dolphin-pause"
      className="border-cyan-500/40 bg-slate-950/90 text-slate-100 shadow-lg shadow-cyan-950/30"
    >
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-wide text-cyan-300">
            <Brain className="h-5 w-5 text-cyan-400" />
            {isDe
              ? 'V4.6-DOLPHIN & V4.6-PAUSE — Unihemisphärische Stadt-Gedächtnis-Homöostase'
              : 'V4.6-DOLPHIN & V4.6-PAUSE — Unihemispheric City Memory Homeostasis'}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-emerald-300 border border-emerald-500/30">
              REGISTER_M · 0 MB VRAM
            </span>
            <span className="rounded bg-cyan-950/80 px-2 py-0.5 text-cyan-300 border border-cyan-500/30">
              {activeBank} · EP {epoch}
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          {isDe
            ? 'Ein 24/7-Quantum-City-Brain darf niemals abschalten — wie Große Tümmler schläft immer eine Hemisphäre (DOLPHIN_SWEEP @ 41.451 vec/s), während die Gegenseite Live-Befehle am eingefrorenen 130-nm-Silizium-ROM prüft und Widersprüche in 0,896 ms per Epistemischer Pause in T_I/O isoliert.'
            : 'A 24/7 Quantum City Brain can never power down — modeled on bottlenose dolphins, one hemisphere consolidates (DOLPHIN_SWEEP @ 41,451 vec/s) while the contralateral hemisphere screens live commands against the frozen 130 nm silicon ROM and isolates contradictions in 0.896 ms via Epistemic Pause.'}
        </p>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {/* Verified Figure 1 Architecture Diagram */}
        <figure className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
          <img
            src="/pqms_v45_v46_dolphin_pause_architecture.jpg"
            alt="PQMS V4.5-DOLPHIN & V4.6-PAUSE Unihemispheric Architecture & Verified Telemetry"
            className="w-full object-cover"
          />
          <figcaption className="border-t border-slate-800 px-3 py-2 text-[11px] text-slate-400">
            {isDe
              ? 'Figure 1 | V4.5-DOLPHIN & V4.6-PAUSE: Pre-Inference Epistemic Pause (0,896 ms), 192 KiB CPU-Cache (0,635 ms, 0 MB VRAM), 49.365 PKB-Sweep in 1,19 s (O(N)), 134/134 Python/RTL + 36/36 Kotlin + 10/10 AST Gates.'
              : 'Figure 1 | V4.5-DOLPHIN & V4.6-PAUSE: Pre-inference Epistemic Pause (0.896 ms), 192 KiB CPU cache (0.635 ms, 0 MB VRAM), 49,365 PKB sweep in 1.19 s (O(N)), 134/134 Python/RTL + 36/36 Kotlin + 10/10 AST gates.'}
          </figcaption>
        </figure>

        {/* Live Fridu / Epistemic Pause Banner */}
        <div
          className={`rounded-lg border p-3.5 transition-colors ${
            epistemicPause
              ? 'border-amber-400/70 bg-amber-950/40 text-amber-100'
              : 'border-cyan-500/30 bg-slate-900/80 text-slate-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span className="flex items-center gap-1.5 font-mono text-xs font-bold">
              {epistemicPause ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-300">EPISTEMIC PAUSE · FRIDU T_I/O ISOLATION</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300">AWAKE_GATE NOMINAL · ZERO-DOWNTIME LOCKSTEP</span>
                </>
              )}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {lastHandoverStatus} · ROOT:{syncRoot}
            </span>
          </div>
          <p className="text-xs leading-relaxed">{friduMessage}</p>
        </div>

        {/* Contralateral Hemisphere Status Grid */}
        <div className="grid gap-3 md:grid-cols-2">
          {(['BANK_A', 'BANK_B'] as const).map((bank) => {
            const isActive = activeBank === bank;
            const bands = bank === 'BANK_A' ? '0.5 · 1.5 · 2.5 · 3.5 · 4.5 · 5.5 Hz' : '1.0 · 2.0 · 3.0 · 4.0 · 5.0 · 6.0 Hz';
            return (
              <div
                key={bank}
                className={`rounded-lg border p-3.5 ${
                  isActive
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-violet-500/40 bg-violet-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-white">{bank}</span>
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-violet-500/20 text-violet-300'
                    }`}
                  >
                    {isActive ? 'AWAKE_GATE (Core 0)' : 'DOLPHIN_SWEEP (Core 1)'}
                  </span>
                </div>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-300">
                  <div>Shards: {bands}</div>
                  <div>
                    {isActive
                      ? 'Gate Floor: C_dir >= 0.68 | 130 nm ROM 3d18f240...'
                      : `Sweep Floor: C_dir >= 0.72 | O(N) 41.45k vec/s${thermalDeferred ? ' [THERMAL DEFERRED]' : ''}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive City Brain Controls + Stage-6 Thermal Slider */}
        <div className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <Thermometer className="h-4 w-4 text-orange-400" />
              Stage-6 HBM Temp: <strong className={hbmTempC >= 82 ? 'text-amber-300' : 'text-cyan-300'}>{hbmTempC} °C</strong>
              <span className="text-[10px] text-slate-400">(Guard &ge; 82 °C)</span>
            </label>
            <input
              type="range"
              min={55}
              max={90}
              value={hbmTempC}
              onChange={(e) => setHbmTempC(Number(e.target.value))}
              className="w-44 accent-cyan-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCoherentCommand}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-600/90 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-emerald-500 transition"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isDe ? 'Kohärenter Befehl (Pass)' : 'Coherent Command (Pass)'}
            </button>
            <button
              type="button"
              onClick={() => handleEpistemicPause('CONTRADICTION')}
              className="inline-flex items-center gap-1.5 rounded bg-amber-600/90 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-amber-500 transition"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {isDe ? 'Widerspruch -> Epistemische Pause' : 'Contradiction -> Epistemic Pause'}
            </button>
            <button
              type="button"
              onClick={handleHemisphereSwitch}
              className="inline-flex items-center gap-1.5 rounded bg-cyan-600/90 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-cyan-500 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {isDe ? `Hemisphäre wechseln (${activeBank} ruht)` : `Switch Hemisphere (${activeBank} rests)`}
            </button>
          </div>
        </div>

        {/* Measured REGISTER_M Signoff Strip */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 font-mono text-xs">
          <div className="rounded border border-slate-800 bg-slate-900/70 p-2.5">
            <div className="text-[10px] text-slate-400 flex items-center gap-1"><Cpu className="h-3 w-3 text-cyan-400" /> 50k PKB Sweep</div>
            <div className="mt-1 font-bold text-cyan-300">1.19 s (41.45k/s)</div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-900/70 p-2.5">
            <div className="text-[10px] text-slate-400 flex items-center gap-1"><Lock className="h-3 w-3 text-emerald-400" /> CPU Cache (192 KiB)</div>
            <div className="mt-1 font-bold text-emerald-300">0.635 ms · 0 MB VRAM</div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-900/70 p-2.5">
            <div className="text-[10px] text-slate-400">Epistemic Pause</div>
            <div className="mt-1 font-bold text-amber-300">0.896 ms · Pass:{passthroughCount}/P:{pauseCount}</div>
          </div>
          <div className="rounded border border-slate-800 bg-slate-900/70 p-2.5">
            <div className="text-[10px] text-slate-400">Verified Signoff</div>
            <div className="mt-1 font-bold text-white">134 Py · 36 Kt · 10 AST</div>
          </div>
        </div>

        {/* Append-Only T_I/O Forensic Quarantine Log */}
        {quarantineLog.length > 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-slate-900/80 p-3 font-mono text-[11px]">
            <div className="mb-1.5 font-bold text-amber-300">
              APPEND-ONLY T_I/O FORENSIC QUARANTINE ({quarantineLog.length})
            </div>
            <div className="space-y-1 text-slate-300">
              {quarantineLog.map((q) => (
                <div key={q.id} className="flex flex-wrap justify-between gap-2 border-t border-slate-800/80 pt-1">
                  <span>{q.id} [{q.bank} EP {q.epoch}] · {q.reason}</span>
                  <span className="text-amber-300">C_dir={q.rcf.toFixed(4)} · {q.digest}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default V46DolphinPauseControl;
