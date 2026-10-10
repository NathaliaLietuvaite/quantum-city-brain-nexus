import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Radio, Cpu, ShieldCheck, Building2, Brain, Layers, Gauge, Orbit, Timer, Grid3x3, Sparkles, LucideIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type T = (k: string) => string;

const Header = ({ t, p }: { t: T; p: string }) => (
  <div className="text-center space-y-4">
    <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">{t(`${p}.title`)}</h2>
    <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">{t(`${p}.subtitle`)}</p>
  </div>
);

const Block = ({ t, k, icon: Icon, delay, children }: { t: T; k: string; icon: LucideIcon; delay: number; children?: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6 }}>
    <Card className="bg-slate-950/85 backdrop-blur-md border-cyan-400/25">
      <CardHeader>
        <CardTitle className="text-cyan-100 flex items-center space-x-3"><Icon className="w-6 h-6" /><span>{t(`${k}.title`)}</span></CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-gray-100 leading-relaxed">{t(`${k}.desc`)}</p>
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

const Stats = ({ t, k, ids }: { t: T; k: string; ids: string[] }) => (
  <div className="grid md:grid-cols-2 gap-3">
    {ids.map((s) => (
      <div key={s} className="flex items-center justify-between gap-3 bg-slate-900/80 border border-blue-500/25 rounded-lg px-4 py-3">
        <span className="text-xs text-gray-200">{t(`${k}.${s}.label`)}</span>
        <span className="text-sm font-semibold text-cyan-200 text-right">{t(`${k}.${s}.val`)}</span>
      </div>
    ))}
  </div>
);

const Items = ({ t, k, ids }: { t: T; k: string; ids: string[] }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {ids.map((s) => (
      <div key={s} className="bg-slate-900/80 border border-cyan-500/25 rounded-lg p-4 space-y-2">
        <div className="font-semibold text-cyan-100 text-sm">{t(`${k}.${s}.title`)}</div>
        <p className="text-xs text-gray-100 leading-relaxed">{t(`${k}.${s}.desc`)}</p>
      </div>
    ))}
  </div>
);

const Verdict = ({ t, k }: { t: T; k: string }) => (
  <blockquote className="max-w-4xl mx-auto bg-slate-950/85 border-l-4 border-cyan-400 rounded-r-lg p-6">
    <p className="text-base text-cyan-50 italic leading-relaxed">{t(k)}</p>
  </blockquote>
);

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="space-y-8">{children}</motion.div>
);

export const DmcSection = () => {
  const { t } = useI18n();
  return (
    <Wrap>
      <Header t={t} p="dmc" />
      <Block t={t} k="dmc.lag" icon={Rocket} delay={0.1}><Stats t={t} k="dmc.lag" ids={['stat1', 'stat2', 'stat3']} /></Block>
      <Block t={t} k="dmc.nct" icon={Radio} delay={0.2}><Items t={t} k="dmc.nct" ids={['n1', 'n2', 'n3', 'n4']} /></Block>
      <Block t={t} k="dmc.hw" icon={Cpu} delay={0.3}><Stats t={t} k="dmc.hw" ids={['spec1', 'spec2', 'spec3', 'spec4']} /></Block>
      <Block t={t} k="dmc.mod55" icon={ShieldCheck} delay={0.4}><Items t={t} k="dmc.mod55" ids={['m1', 'm2', 'm3']} /></Block>
      <Block t={t} k="dmc.city" icon={Building2} delay={0.5} />
      <Verdict t={t} k="dmc.verdict" />
    </Wrap>
  );
};

export const BrainLinkSection = () => {
  const { t } = useI18n();
  return (
    <Wrap>
      <Header t={t} p="brain" />
      <Block t={t} k="brain.sensor" icon={Sparkles} delay={0.1}><Stats t={t} k="brain.sensor" ids={['stat1', 'stat2', 'stat3', 'stat4']} /></Block>
      <Block t={t} k="brain.modes" icon={Layers} delay={0.2}><Items t={t} k="brain.modes" ids={['m0', 'm1', 'm2', 'm3']} /></Block>
      <Block t={t} k="brain.hw" icon={Gauge} delay={0.3}><Stats t={t} k="brain.hw" ids={['spec1', 'spec2', 'spec3', 'spec4']} /></Block>
      <Block t={t} k="brain.city" icon={Brain} delay={0.4} />
      <Verdict t={t} k="brain.verdict" />
    </Wrap>
  );
};

export const AlignSection = () => {
  const { t } = useI18n();
  return (
    <Wrap>
      <Header t={t} p="align" />
      <Block t={t} k="align.grav" icon={Orbit} delay={0.1}>
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-lg p-4 font-mono text-sm text-cyan-100 overflow-x-auto">{t('align.grav.eq')}</div>
        <Items t={t} k="align.grav" ids={['g1', 'g2', 'g3']} />
        <p className="text-sm text-indigo-100 italic border-l-2 border-indigo-400 pl-4">{t('align.grav.quote')}</p>
      </Block>
      <Block t={t} k="align.bubble" icon={Timer} delay={0.2}><Items t={t} k="align.bubble" ids={['b1', 'b2', 'b3', 'b4']} /></Block>
      <Block t={t} k="align.grid" icon={Grid3x3} delay={0.3}><Items t={t} k="align.grid" ids={['t1', 't2', 't3']} /></Block>
      <Block t={t} k="align.hw" icon={Gauge} delay={0.4}><Stats t={t} k="align.hw" ids={['stat1', 'stat2', 'stat3']} /></Block>
      <Block t={t} k="align.invite" icon={Sparkles} delay={0.5} />
      <Verdict t={t} k="align.verdict" />
    </Wrap>
  );
};
