import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Magnet, Layers, Timer, KeyRound, Projector, Building2, LucideIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type T = (k: string) => string;

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

const MseSection = () => {
  const { t } = useI18n();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">{t('mse.title')}</h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">{t('mse.subtitle')}</p>
      </div>

      <Block t={t} k="mse.grav" icon={Magnet} delay={0.1}>
        <Items t={t} k="mse.grav" ids={['g1', 'g2', 'g3']} />
      </Block>

      <Block t={t} k="mse.rag" icon={Layers} delay={0.2}>
        <Stats t={t} k="mse.rag" ids={['stat1', 'stat2', 'stat3', 'stat4']} />
      </Block>

      <Block t={t} k="mse.seven" icon={Timer} delay={0.3}>
        <Items t={t} k="mse.seven" ids={['s1', 's2', 's3']} />
      </Block>

      <Block t={t} k="mse.trust" icon={KeyRound} delay={0.4}>
        <Stats t={t} k="mse.trust" ids={['stat1', 'stat2', 'stat3', 'stat4']} />
      </Block>

      <Block t={t} k="mse.morse" icon={Projector} delay={0.5}>
        <Items t={t} k="mse.morse" ids={['m1', 'm2', 'm3', 'm4']} />
      </Block>

      <Block t={t} k="mse.city" icon={Building2} delay={0.6}>
        <ul className="space-y-3">
          {['1', '2', '3'].map((n) => (
            <li key={n} className="flex gap-3 text-sm text-gray-100 leading-relaxed">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
              <span>{t(`mse.city.${n}`)}</span>
            </li>
          ))}
        </ul>
      </Block>

      <blockquote className="max-w-4xl mx-auto bg-slate-950/85 border-l-4 border-cyan-400 rounded-r-lg p-6">
        <p className="text-base text-cyan-50 italic leading-relaxed">{t('mse.verdict')}</p>
      </blockquote>
    </motion.div>
  );
};

export default MseSection;
