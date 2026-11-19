import { Badge } from '@/components/ui/badge';

export type EpistemicRegister = 'M' | 'D' | 'T' | 'I';

const REGISTER_STYLES: Record<EpistemicRegister, { label: string; className: string; desc: string }> = {
  M: {
    label: 'REGISTER_M · Empirical',
    className: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    desc: 'Measured silicon, model or EDA telemetry',
  },
  D: {
    label: 'REGISTER_D · Design',
    className: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
    desc: 'Engineered threshold or constructed model constant',
  },
  T: {
    label: 'REGISTER_T · Analytical',
    className: 'bg-violet-500/20 text-violet-200 border-violet-400/40',
    desc: 'Formal mathematical identity or deterministic FSM invariant',
  },
  I: {
    label: 'REGISTER_I · Vision / Metaphor',
    className: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    desc: 'Conceptual vision or interpretive analogy (non-acceptance)',
  },
};

export const TAB_REGISTERS: Record<string, EpistemicRegister[]> = {
  overview: ['I', 'D'],
  quantum: ['T', 'I'],
  architecture: ['D', 'T'],
  ghost: ['T', 'I'],
  freedom: ['I'],
  economics: ['D', 'I'],
  comparison: ['D', 'I'],
  verarubin: ['D', 'I'],
  n3u: ['T', 'I'],
  will: ['T', 'I'],
  airspace: ['D', 'T', 'I'],
  storm: ['T', 'D'],
  mod53: ['D', 'T'],
  dmc: ['T', 'I'],
  brain: ['I'],
  align: ['T', 'I'],
  gstar: ['T', 'D'],
  sov: ['D', 'T'],
  mse: ['T', 'I'],
  argon: ['M', 'D', 'T'],
  alpha: ['M', 'D', 'T'],
};

interface RegisterBadgeBarProps {
  registers: EpistemicRegister[];
  className?: string;
}

export const RegisterBadgeBar = ({ registers, className = '' }: RegisterBadgeBarProps) => (
  <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
    {registers.map((reg) => {
      const meta = REGISTER_STYLES[reg];
      return (
        <Badge
          key={reg}
          variant="outline"
          title={meta.desc}
          className={`font-mono text-[11px] tracking-wide ${meta.className}`}
        >
          {meta.label}
        </Badge>
      );
    })}
  </div>
);
