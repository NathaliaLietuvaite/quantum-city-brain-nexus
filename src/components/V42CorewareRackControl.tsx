import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShieldCheck,
  Cpu,
  AlertTriangle,
  RefreshCw,
  Activity,
  Lock,
  Radio,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type NodeStatus = 'COHERENT' | 'ESCALATE_P1' | 'STALE_VETO' | 'HEALED';

interface ChainLogEntry {
  epoch: number;
  core: string;
  decision: string;
  detail: string;
  sigMode: string;
}

const V42CorewareRackControl = () => {
  const { lang } = useI18n();
  const isDe = lang === 'de';

  const [epoch, setEpoch] = useState<number>(42);
  const [activeCore, setActiveCore] = useState<'GB300-01.T0.CORE0' | 'GB300-01.T0.CORE1'>('GB300-01.T0.CORE0');
  const [core0Online, setCore0Online] = useState<boolean>(true);
  const [staleWorkerIdx, setStaleWorkerIdx] = useState<number | null>(null);
  const [shockwaveActive, setShockwaveActive] = useState<boolean>(false);
  const [stopAndGoEliminatedPct, setStopAndGoEliminatedPct] = useState<number>(99.4);
  const [logs, setLogs] = useState<ChainLogEntry[]>([
    {
      epoch: 42,
      core: 'GB300-01.T0.CORE0',
      decision: 'LOCAL_L2_COHERENT_PASS',
      detail: isDe
        ? '72× Die-lokale L2-Spiegel (2.00 MiB) kohärent • FSD Grüne Welle aktiv (0 Stop-and-Go)'
        : '72× die-local L2 mirrors (2.00 MiB) coherent • FSD green wave active (0 stop-and-go)',
      sigMode: 'HYBRID_ECDSA_P256_ML-DSA-65',
    },
  ]);

  const pushLog = (nextEpoch: number, core: string, decision: string, detail: string) => {
    setLogs((prev) => [{ epoch: nextEpoch, core, decision, detail, sigMode: 'HYBRID_ECDSA_P256_ML-DSA-65' }, ...prev].slice(0, 5));
  };

  const handleShockwave = () => {
    const nextEp = epoch + 1;
    setEpoch(nextEp);
    setShockwaveActive(true);
    setStaleWorkerIdx(null);
    setStopAndGoEliminatedPct(99.8);
    pushLog(
      nextEp,
      activeCore,
      'P0_MANIFOLD_COMMIT',
      isDe
        ? `Stop-and-Go-Bremswelle erkannt (RCF=0.925 → P1 → P0) • Atomarer Epoch-${nextEp}-Broadcast glättet FSD-Korridor (1.921 µs)`
        : `Stop-and-go shockwave detected (RCF=0.925 → P1 → P0) • Atomic Epoch-${nextEp} broadcast smooths FSD corridor (1.921 µs)`
    );
  };

  const handleCore0Failover = () => {
    const nextCore = core0Online ? 'GB300-01.T0.CORE1' : 'GB300-01.T0.CORE0';
    setCore0Online(!core0Online);
    setActiveCore(nextCore);
    const nextEp = epoch + 1;
    setEpoch(nextEp);
    pushLog(
      nextEp,
      nextCore,
      'ZERO_DROP_FAILOVER',
      isDe
        ? `${core0Online ? 'CORE0 isoliert → Sofort-Failover auf CORE1' : 'CORE0 wiederhergestellt → Active-Active'} (0 verlorene FSD-Entscheidungen)`
        : `${core0Online ? 'CORE0 isolated → instant failover to CORE1' : 'CORE0 restored → Active-Active'} (0 dropped FSD decisions)`
    );
  };

  const handlePartitionWorker = () => {
    const nextEp = epoch + 1;
    setEpoch(nextEp);
    setStaleWorkerIdx(7);
    setShockwaveActive(false);
    pushLog(
      nextEp,
      activeCore,
      'STALE_EPOCH_VETO',
      isDe
        ? `Worker T2.D00.R07 verpasst Epoch ${nextEp} → Fail-Closed STALE_EPOCH_VETO (0 Clone-Entropie)`
        : `Worker T2.D00.R07 missed Epoch ${nextEp} → Fail-Closed STALE_EPOCH_VETO (0 clone entropy)`
    );
  };

  const handleDriftResync = () => {
    if (staleWorkerIdx === null) return;
    setStaleWorkerIdx(null);
    setShockwaveActive(false);
    pushLog(
      epoch,
      activeCore,
      'AUTONOMOUS_RESYNC_OK',
      isDe
        ? `Worker T2.D00.R07 ruft request_drift_resync() → Epoch ${epoch} geheilt (72/72 kohärent)`
        : `Worker T2.D00.R07 invokes request_drift_resync() → Epoch ${epoch} healed (72/72 coherent)`
    );
  };

  const getNodeStatus = (idx: number): NodeStatus => {
    if (staleWorkerIdx === idx) return 'STALE_VETO';
    if (shockwaveActive && idx >= 12 && idx < 24) return 'ESCALATE_P1';
    return 'COHERENT';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.6 }}
    >
      <Card className="bg-gradient-to-br from-slate-950/95 via-blue-950/80 to-purple-950/75 backdrop-blur-md border-cyan-400/40 shadow-xl">
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-cyan-100 flex items-center gap-2 text-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>
                {isDe
                  ? 'V4.2-COREWARE: Best-of-Both-Worlds Rack-Steuerung & FSD Stop-and-Go-Elimination'
                  : 'V4.2-COREWARE: Best-of-Both-Worlds Rack Control & FSD Stop-and-Go Elimination'}
              </span>
            </CardTitle>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-400/40">
              REGISTER_M • SYNC-22 VERIFIED
            </span>
          </div>
          <p className="text-sm text-gray-300">
            {isDe
              ? 'Tier 2 + LocalL2Mirror (2.00 MiB) laufen 100 % Bare-Metal im VRAM/L2 (O(1) Zero-Hop), während 2× physische V-4.0-Cores (130 nm IHP SG13G2) im PCIe-/Switch-Tray als unbestechlicher P0-Anker für Epoch-Broadcasts, Drift-Korrektur und den harten STOP dienen.'
              : 'Tier 2 + LocalL2Mirror (2.00 MiB) execute 100% bare-metal in die-local VRAM/L2 (O(1) zero-hop), while 2× physical V-4.0 cores (130 nm IHP SG13G2) on a PCIe/Switch tray serve as an uncorruptible P0 anchor for epoch broadcasts, drift correction, and hard STOP.'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Verified REGISTER_M Telemetry Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/25">
              <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> TIER-0 PAIR (2× V-4.0)
              </div>
              <div className="text-lg font-bold text-white mt-1">1.041M tx/s</div>
              <div className="text-[11px] text-gray-400">1.921 µs • SS 125°C: 657k tx/s</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-emerald-500/25">
              <div className="text-[11px] font-mono text-emerald-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> VCD SIGNOFF POWER
              </div>
              <div className="text-lg font-bold text-white mt-1">34.06 nJ/tx</div>
              <div className="text-[11px] text-gray-400">17.03 mW (-98.0% vs. vecless)</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-purple-500/25">
              <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> FIPS 204 HYBRID PQ
              </div>
              <div className="text-lg font-bold text-white mt-1">ML-DSA-65</div>
              <div className="text-[11px] text-gray-400">ECDSA P-256 + 3,309 B PQ Sig</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-blue-500/25">
              <div className="text-[11px] font-mono text-blue-300 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> FSD STOP-AND-GO
              </div>
              <div className="text-lg font-bold text-emerald-300 mt-1">-{stopAndGoEliminatedPct}%</div>
              <div className="text-[11px] text-gray-400">PCIe P2P: 266 MB/s (&lt;0.5%)</div>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleShockwave}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-100 border border-cyan-400/40 transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              {isDe ? 'FSD Stop-and-Go Welle glätten (P0 Epoch)' : 'Smooth FSD Stop-and-Go Wave (P0 Epoch)'}
            </button>
            <button
              type="button"
              onClick={handleCore0Failover}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 text-purple-100 border border-purple-400/40 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {core0Online
                ? (isDe ? 'CORE0 Failover injizieren → CORE1' : 'Inject CORE0 Failover → CORE1')
                : (isDe ? 'CORE0 wiederherstellen' : 'Restore CORE0')}
            </button>
            <button
              type="button"
              onClick={handlePartitionWorker}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-rose-600/30 hover:bg-rose-600/50 text-rose-100 border border-rose-400/40 transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {isDe ? 'Stale L2 Mirror (Worker #7)' : 'Stale L2 Mirror (Worker #7)'}
            </button>
            {staleWorkerIdx !== null && (
              <button
                type="button"
                onClick={handleDriftResync}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600/40 hover:bg-emerald-600/60 text-emerald-100 border border-emerald-400/60 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {isDe ? 'Autonomous Drift Resync (#7)' : 'Autonomous Drift Resync (#7)'}
              </button>
            )}
          </div>

          {/* 72-Accelerator NVL72 Shared-L2-Manifold Live Grid */}
          <div className="p-4 rounded-lg bg-slate-900/75 border border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between text-xs font-mono">
              <span className="text-cyan-200">
                SHARED-L2-MANIFOLD • EPOCH #{epoch} • ACTIVE TIER-0: <strong className="text-emerald-300">{activeCore}</strong>
              </span>
              <span className="text-gray-400">
                {staleWorkerIdx === null ? '72/72 COHERENT (0 CLONE ENTROPY)' : '71/72 COHERENT • 1 STALE_EPOCH_VETO'}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1.5">
              {Array.from({ length: 72 }).map((_, idx) => {
                const st = getNodeStatus(idx);
                const cls =
                  st === 'STALE_VETO'
                    ? 'bg-rose-500/80 border-rose-300 text-white animate-pulse'
                    : st === 'ESCALATE_P1'
                    ? 'bg-amber-500/60 border-amber-300 text-amber-50'
                    : 'bg-cyan-500/25 border-cyan-400/40 text-cyan-200';
                return (
                  <div
                    key={idx}
                    title={`GB300-01.T2.D0${Math.floor(idx / 12)}.R${String(idx).padStart(2, '0')} (${st})`}
                    className={`h-6 rounded border text-[9px] font-mono flex items-center justify-center ${cls}`}
                  >
                    {idx}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signed Provenance Chain Feed */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>SIGNED PROVENANCE CHAIN (ECDSA P-256 + ML-DSA-65)</span>
            </div>
            <div className="space-y-1.5">
              {logs.map((entry, idx) => (
                <div
                  key={`${entry.epoch}-${idx}`}
                  className="p-2.5 rounded bg-slate-950/80 border border-white/10 text-xs font-mono flex flex-col md:flex-row md:items-center md:justify-between gap-1"
                >
                  <div className="text-gray-200">
                    <span className="text-cyan-400">[EP-{entry.epoch}]</span>{' '}
                    <span className="text-purple-300">{entry.core}</span>{' '}
                    <span className="text-emerald-300 font-bold">{entry.decision}</span> — {entry.detail}
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{entry.sigMode}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default V42CorewareRackControl;
