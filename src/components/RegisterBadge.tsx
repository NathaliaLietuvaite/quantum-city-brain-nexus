import { Badge } from '@/components/ui/badge';
import { TAB_REGISTERS_MAP, type EpistemicRegister } from '@/lib/mission-control';

export type { EpistemicRegister };

export const REGISTER_STYLES: Record<EpistemicRegister, { label: string; className: string; desc: string }> = {
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

export const REGISTER_DOT_COLORS: Record<EpistemicRegister, string> = {
  M: 'bg-emerald-400',
  D: 'bg-sky-400',
  T: 'bg-violet-400',
  I: 'bg-amber-400',
};

export const TRUTH_LENS_STAGE_FRAME: Record<EpistemicRegister, string> = {
  M: 'rounded-2xl border-2 border-emerald-400/65 bg-emerald-950/15 p-3 md:p-5 shadow-lg shadow-emerald-950/40',
  T: 'rounded-2xl border-2 border-violet-400/60 bg-violet-950/15 p-3 md:p-5 shadow-lg shadow-violet-950/40',
  D: 'rounded-2xl border-2 border-sky-400/60 bg-sky-950/15 p-3 md:p-5 shadow-lg shadow-sky-950/40',
  I: 'rounded-2xl border-2 border-amber-400/65 bg-amber-950/15 p-3 md:p-5 shadow-lg shadow-amber-950/40',
};

export const TAB_REGISTERS = TAB_REGISTERS_MAP;

interface RegisterBadgeBarProps {
  registers: readonly EpistemicRegister[];
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
