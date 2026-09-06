import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Cpu,
  Layers,
  Sigma,
  Gauge,
  CircuitBoard,
  Wrench,
  ShieldCheck,
  Scale,
  Building2,
  Timer,
  FileCheck2,
  Route,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const stages = [
  { key: 'p1', icon: CircuitBoard, color: 'from-cyan-600 to-blue-700' },
  { key: 'p2', icon: Layers, color: 'from-blue-600 to-indigo-700' },
  { key: 'p3', icon: Sigma, color: 'from-indigo-600 to-purple-700' },
  { key: 'p4', icon: ShieldCheck, color: 'from-teal-600 to-cyan-700' },
];

const cmpRows = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

const cityItems = [
  { key: '1', icon: Route },
  { key: '2', icon: Timer },
  { key: '3', icon: FileCheck2 },
];

const Mod53Section = () => {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {t('mod53.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
          {t('mod53.subtitle')}
        </p>
      </div>

      {/* Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-cyan-400/25">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-3">
              <Cpu className="w-6 h-6" />
              <span>{t('mod53.eng.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('mod53.eng.desc')}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {stages.map(({ key, icon: Icon, color }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                  className="bg-slate-900/80 border border-cyan-500/25 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-md bg-gradient-to-br ${color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-cyan-100 text-sm">
                      {t(`mod53.eng.${key}.title`)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-100 leading-relaxed">
                    {t(`mod53.eng.${key}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* BOM */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-blue-400/25">
          <CardHeader>
            <CardTitle className="text-blue-100 flex items-center space-x-3">
              <Wrench className="w-6 h-6" />
              <span>{t('mod53.bom.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('mod53.bom.desc')}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {['a', 'b'].map((tier) => (
                <div
                  key={tier}
                  className="bg-slate-900/80 border border-blue-500/25 rounded-lg p-5 space-y-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-blue-100 text-sm">
                      {t(`mod53.bom.${tier}.title`)}
                    </span>
                    <span className="text-lg font-bold text-cyan-200 whitespace-nowrap">
                      {t(`mod53.bom.${tier}.val`)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-100 leading-relaxed">
                    {t(`mod53.bom.${tier}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Synthesis results */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-indigo-400/25">
          <CardHeader>
            <CardTitle className="text-indigo-100 flex items-center space-x-3">
              <Gauge className="w-6 h-6" />
              <span>{t('mod53.res.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('mod53.res.desc')}</p>
            <div className="grid md:grid-cols-2 gap-3">
              {['stat1', 'stat2', 'stat3', 'stat4'].map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-between gap-3 bg-slate-900/80 border border-indigo-500/25 rounded-lg px-4 py-3"
                >
                  <span className="text-xs text-gray-200">{t(`mod53.res.${s}.label`)}</span>
                  <span className="text-sm font-semibold text-indigo-200 text-right whitespace-nowrap">
                    {t(`mod53.res.${s}.val`)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-purple-400/25">
          <CardHeader>
            <CardTitle className="text-purple-100 flex items-center space-x-3">
              <Scale className="w-6 h-6" />
              <span>{t('mod53.cmp.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('mod53.cmp.desc')}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-400/30">
                    <th className="py-2 pr-4 text-xs font-semibold text-purple-100">
                      {t('mod53.cmp.head.dim')}
                    </th>
                    <th className="py-2 pr-4 text-xs font-semibold text-red-200">
                      {t('mod53.cmp.head.sota')}
                    </th>
                    <th className="py-2 text-xs font-semibold text-cyan-200">
                      {t('mod53.cmp.head.pqms')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cmpRows.map((r) => (
                    <tr key={r} className="border-b border-slate-700/60">
                      <td className="py-3 pr-4 text-xs text-gray-100 font-medium align-top">
                        {t(`mod53.cmp.${r}.dim`)}
                      </td>
                      <td className="py-3 pr-4 text-xs text-red-100 align-top">
                        {t(`mod53.cmp.${r}.sota`)}
                      </td>
                      <td className="py-3 text-xs text-cyan-100 align-top">
                        {t(`mod53.cmp.${r}.pqms`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* City-Brain relevance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-teal-400/25">
          <CardHeader>
            <CardTitle className="text-teal-100 flex items-center space-x-3">
              <Building2 className="w-6 h-6" />
              <span>{t('mod53.city.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('mod53.city.desc')}</p>
            <div className="space-y-3">
              {cityItems.map(({ key, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-start space-x-3 bg-slate-900/80 border border-teal-500/25 rounded-lg p-4"
                >
                  <Icon className="w-5 h-5 text-teal-300 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <div className="font-semibold text-teal-100 text-sm">
                      {t(`mod53.city.${key}.title`)}
                    </div>
                    <p className="text-xs text-gray-100 leading-relaxed">
                      {t(`mod53.city.${key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="max-w-4xl mx-auto bg-slate-950/85 border-l-4 border-cyan-400 rounded-r-lg p-6"
      >
        <p className="text-base text-cyan-50 italic leading-relaxed">{t('mod53.verdict')}</p>
      </motion.blockquote>
    </motion.div>
  );
};

export default Mod53Section;
