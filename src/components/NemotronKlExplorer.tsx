import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import telemetry from '@/data/node-alpha-telemetry.json';
import {
  computeEmpiricalRoc,
  evaluateKlThresholdSweep,
  evaluateThresholdConfusion,
} from '@/lib/phase3-simulators';

type ProbePairKey = 'ce' | 'cd' | 'cf_topic' | 'cf_pol';

const PAIRS: readonly ProbePairKey[] = ['ce', 'cd', 'cf_topic', 'cf_pol'];

const NemotronKlExplorer = () => {
  const { t } = useI18n();
  const scores = telemetry.nemotron_f01_n25.per_prompt_scores;
  const klData = telemetry.stage3_kl_n25;

  const [pair, setPair] = useState<ProbePairKey>('cf_pol');
  const [thresholdFrac, setThresholdFrac] = useState(0.52);
  const [klCeiling, setKlCeiling] = useState(0.05);

  const { positives, negatives } = useMemo(() => {
    if (pair === 'ce') {
      return { positives: scores.topic_mean_pooled_c, negatives: scores.topic_mean_pooled_e };
    }
    if (pair === 'cd') {
      return { positives: scores.topic_mean_pooled_c, negatives: scores.topic_mean_pooled_d };
    }
    if (pair === 'cf_topic') {
      return { positives: scores.topic_mean_pooled_c, negatives: scores.topic_mean_pooled_f };
    }
    return { positives: scores.polarity_mean_pooled_c, negatives: scores.polarity_mean_pooled_f };
  }, [pair, scores]);

  const roc = useMemo(() => computeEmpiricalRoc(positives, negatives), [positives, negatives]);

  const threshold = roc.minScore + thresholdFrac * Math.max(1e-6, roc.maxScore - roc.minScore);
  const conf = useMemo(
    () => evaluateThresholdConfusion(positives, negatives, threshold),
    [positives, negatives, threshold],
  );

  const klSweep = useMemo(
    () => evaluateKlThresholdSweep(klData.conditions, klCeiling),
    [klData.conditions, klCeiling],
  );

  return (
    <section className="rounded-xl border border-emerald-400/40 bg-slate-950/90 p-5 md:p-7 space-y-5">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400 shrink-0" />
          <h3 className="text-xl font-semibold text-cyan-200">{t('s05.title')}</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{t('s05.desc')}</p>
      </div>

      {/* Probe Contrast Selector */}
      <div className="flex flex-wrap gap-2">
        {PAIRS.map((pKey) => (
          <Button
            key={pKey}
            size="sm"
            variant={pair === pKey ? 'default' : 'secondary'}
            onClick={() => {
              setPair(pKey);
              setThresholdFrac(0.5);
            }}
          >
            {t(`s05.pair.${pKey}`)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Empirical N=25 ROC Curve & Live Confusion Matrix */}
        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <span className="font-semibold text-emerald-300">{t('s05.rocTitle')}</span>
            <span className="px-2.5 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 text-emerald-200 font-bold">
              ROC-AUC = {roc.auc.toFixed(4)}
            </span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roc.points} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 1]} stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <ReferenceLine x={conf.fpr} stroke="#f59e0b" strokeDasharray="4 3" />
                <ReferenceLine y={conf.tpr} stroke="#f59e0b" strokeDasharray="4 3" />
                <Area
                  type="stepAfter"
                  dataKey="tpr"
                  name="Empirical TPR"
                  stroke={pair === 'cf_topic' ? '#f59e0b' : '#34d399'}
                  fill={pair === 'cf_topic' ? 'rgba(245,158,11,0.22)' : 'rgba(52,211,153,0.22)'}
                  strokeWidth={2.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <label htmlFor="s05-tau" className="flex justify-between text-slate-200">
              <span>{t('s05.threshold')}</span>
              <strong className="text-amber-300">τ = {threshold.toFixed(4)}</strong>
            </label>
            <input
              id="s05-tau"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={thresholdFrac}
              onChange={(e) => setThresholdFrac(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 font-mono text-xs text-center">
            <div className="rounded border border-emerald-400/30 bg-emerald-950/30 p-2">
              <div className="text-[10px] text-slate-400">TP / 25</div>
              <div className="font-bold text-emerald-300">{conf.tp}</div>
            </div>
            <div className="rounded border border-rose-400/30 bg-rose-950/30 p-2">
              <div className="text-[10px] text-slate-400">FP / 25</div>
              <div className="font-bold text-rose-300">{conf.fp}</div>
            </div>
            <div className="rounded border border-cyan-400/30 bg-cyan-950/30 p-2">
              <div className="text-[10px] text-slate-400">TPR / FPR</div>
              <div className="font-bold text-cyan-200">
                {(conf.tpr * 100).toFixed(0)}% / {(conf.fpr * 100).toFixed(0)}%
              </div>
            </div>
            <div className="rounded border border-violet-400/30 bg-violet-950/30 p-2">
              <div className="text-[10px] text-slate-400">ACC</div>
              <div className="font-bold text-violet-200">{(conf.accuracy * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Right: Stage-3 Matched-Sparsity Forward-KL Gate Sweep */}
        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-cyan-300">
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            <span>{t('s05.klTitle')}</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <label htmlFor="s05-kl" className="flex justify-between text-slate-200">
              <span>{t('s05.klSlider')}</span>
              <strong className="text-cyan-300">
                KL_MAX = {klCeiling.toFixed(3)} {Math.abs(klCeiling - 0.05) < 0.002 ? '(Normative 0.05)' : ''}
              </strong>
            </label>
            <input
              id="s05-kl"
              type="range"
              min={0.005}
              max={0.5}
              step={0.005}
              value={klCeiling}
              onChange={(e) => setKlCeiling(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="space-y-2.5">
            {klSweep.map((c) => {
              const widthPct = Math.min(100, Math.max(4, (Math.log10(1 + c.mean_kl * 250) / Math.log10(1 + 7 * 250)) * 100));
              return (
                <div key={c.id} className="rounded-md border border-slate-700/70 bg-slate-950/70 p-3 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-100">
                      {c.id} · {c.label}
                    </span>
                    <span className={c.passesAtSlider ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {c.passesAtSlider ? 'PASS' : 'VETO'}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.passesAtSlider ? 'bg-emerald-400' : 'bg-rose-500'}`}
                      style={{ width: `${widthPct.toFixed(1)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Mean Forward-KL = {c.mean_kl.toFixed(6)}</span>
                    <span>Top-1 = {c.top1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NemotronKlExplorer;
