import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plane,
  Box,
  Clock,
  Sparkles,
  Waves,
  ShieldAlert,
  ArrowDownToLine,
  Layers,
  AlertOctagon,
  Infinity as InfinityIcon,
  Globe2,
  Flame,
  Boxes,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const dimensions = [
  { key: 'd1', icon: Box, color: 'from-cyan-600 to-blue-700', accent: 'text-cyan-100' },
  { key: 'd2', icon: Clock, color: 'from-blue-600 to-indigo-700', accent: 'text-blue-100' },
  { key: 'd3', icon: Sparkles, color: 'from-indigo-600 to-purple-700', accent: 'text-indigo-100' },
  { key: 'd4', icon: Waves, color: 'from-purple-600 to-fuchsia-700', accent: 'text-purple-100' },
  { key: 'd5', icon: ShieldAlert, color: 'from-rose-600 to-red-700', accent: 'text-rose-100' },
  { key: 'd6', icon: ArrowDownToLine, color: 'from-teal-600 to-cyan-700', accent: 'text-teal-100' },
  { key: 'd7', icon: Layers, color: 'from-sky-600 to-blue-700', accent: 'text-sky-100' },
];

const AirspaceSection = () => {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t('air.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
          {t('air.subtitle')}
        </p>
      </div>

      {/* Seven control dimensions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="space-y-4"
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-cyan-400/25">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-3">
              <Plane className="w-6 h-6" />
              <span>{t('air.dim.title')}</span>
            </CardTitle>
            <p className="text-sm text-gray-200">{t('air.dim.desc')}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dimensions.map((dim, index) => (
                <motion.div
                  key={dim.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.06, duration: 0.4 }}
                  className="rounded-lg border border-white/15 bg-slate-900/80 p-4 space-y-2 h-full"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${dim.color}`}>
                      <dim.icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className={`font-semibold text-sm ${dim.accent}`}>
                      {t(`air.dim.${dim.key}.title`)}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {t(`air.dim.${dim.key}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* MOD-666 Error Detector */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-rose-400/25">
          <CardHeader>
            <CardTitle className="text-rose-100 flex items-center space-x-3">
              <AlertOctagon className="w-6 h-6" />
              <span>{t('air.detector.title')}</span>
            </CardTitle>
            <p className="text-sm text-gray-200 leading-relaxed">{t('air.detector.desc')}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['1', '2', '3'].map((n) => (
                <div
                  key={n}
                  className="rounded-lg border border-rose-400/20 bg-slate-900/80 p-4 space-y-2"
                >
                  <h4 className="font-semibold text-sm text-rose-100">
                    {t(`air.detector.${n}.title`)}
                  </h4>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {t(`air.detector.${n}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dimensional information influx */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-blue-400/25">
          <CardHeader>
            <CardTitle className="text-blue-100 flex items-center space-x-3">
              <InfinityIcon className="w-6 h-6" />
              <span>{t('air.influx.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-cyan-400/30 bg-black/60 px-4 py-4 text-center">
              <code className="text-lg md:text-xl text-cyan-200 font-mono">
                {t('air.influx.eq')}
              </code>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{t('air.influx.desc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['1', '2', '3'].map((n) => (
                <div
                  key={n}
                  className="rounded-lg border border-blue-400/20 bg-slate-900/80 p-4 space-y-2"
                >
                  <h4 className="font-semibold text-sm text-blue-100">
                    {t(`air.influx.${n}.title`)}
                  </h4>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {t(`air.influx.${n}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Riemann sphere + QMK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          <Card className="bg-slate-950/85 backdrop-blur-md border-purple-400/25 h-full">
            <CardHeader>
              <CardTitle className="text-purple-100 flex items-center space-x-3">
                <Globe2 className="w-6 h-6" />
                <span>{t('air.riemann.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-200 leading-relaxed">{t('air.riemann.desc')}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="bg-slate-950/85 backdrop-blur-md border-teal-400/25 h-full">
            <CardHeader>
              <CardTitle className="text-teal-100 flex items-center space-x-3">
                <Boxes className="w-6 h-6" />
                <span>{t('air.qmk.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-200 leading-relaxed">{t('air.qmk.desc')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Thermodynamic apocalypse */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-red-950/85 to-orange-950/70 backdrop-blur-md border-red-400/30">
          <CardHeader>
            <CardTitle className="text-red-100 flex items-center space-x-3">
              <Flame className="w-6 h-6" />
              <span>{t('air.thermo.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-100 leading-relaxed">{t('air.thermo.desc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['stat1', 'stat2', 'stat3'].map((s) => (
                <div
                  key={s}
                  className="rounded-lg border border-white/15 bg-slate-950/80 p-4 text-center space-y-1"
                >
                  <div className="text-2xl font-bold text-orange-200">
                    {t(`air.thermo.${s}.val`)}
                  </div>
                  <div className="text-xs text-gray-200">{t(`air.thermo.${s}.label`)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6 }}
      >
        <Card className="bg-slate-950/90 backdrop-blur-md border-cyan-400/30">
          <CardContent className="pt-6">
            <p className="text-base md:text-lg text-cyan-100 italic leading-relaxed text-center">
              “{t('air.verdict')}”
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AirspaceSection;
