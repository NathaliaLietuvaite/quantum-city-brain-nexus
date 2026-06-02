import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Lock, ShieldCheck, Layers, Gauge, Zap, Car, Network, GitMerge } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const VeraRubinSection = () => {
  const { t } = useI18n();

  const hwSpecs = [
    { key: 'gpu', icon: Cpu },
    { key: 'fabric', icon: Network },
    { key: 'mem', icon: Layers },
    { key: 'fp4', icon: Gauge },
  ];

  const mappings = [
    { key: 'mtsc', icon: Cpu, color: 'from-blue-600 to-cyan-600' },
    { key: 'vector', icon: Lock, color: 'from-purple-600 to-blue-600' },
    { key: 'odos', icon: ShieldCheck, color: 'from-emerald-600 to-green-600' },
    { key: 'filter', icon: Zap, color: 'from-cyan-600 to-sky-600' },
  ];

  const perf = ['util', 'compound', 'gate'];

  const fsd = [
    { key: 'bridge', icon: GitMerge, color: 'text-cyan-300' },
    { key: 'corridor', icon: Network, color: 'text-blue-300' },
    { key: 'fallback', icon: Car, color: 'text-emerald-300' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t('vr.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
          {t('vr.subtitle')}
        </p>
      </div>

      {/* Hardware specs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-blue-950/70 backdrop-blur-md border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-3">
              <Cpu className="w-6 h-6" />
              <span>{t('vr.hw.title')}</span>
            </CardTitle>
            <p className="text-sm text-gray-300">{t('vr.hw.desc')}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hwSpecs.map((spec) => (
                <div key={spec.key} className="text-center space-y-2 p-4 bg-blue-950/50 rounded-lg border border-cyan-500/20">
                  <spec.icon className="w-6 h-6 text-cyan-400 mx-auto" />
                  <div className="text-2xl font-bold text-cyan-300">{t(`vr.spec.${spec.key}.val`)}</div>
                  <div className="text-xs text-gray-200">{t(`vr.spec.${spec.key}.label`)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Architectural mapping */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-white">{t('vr.map.title')}</h3>
        <p className="text-center text-gray-300 max-w-3xl mx-auto text-sm">{t('vr.map.desc')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mappings.map((m, index) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-slate-900/80 backdrop-blur-md border-white/15 h-full hover:bg-slate-900/90 transition-all">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${m.color}`}>
                      <m.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg">{t(`vr.map.${m.key}.title`)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className="px-2 py-1 rounded bg-purple-900/50 text-purple-100 border border-purple-500/30">{t(`vr.map.${m.key}.pqms`)}</span>
                    <span className="text-cyan-400">→</span>
                    <span className="px-2 py-1 rounded bg-cyan-900/50 text-cyan-100 border border-cyan-500/30">{t(`vr.map.${m.key}.hw`)}</span>
                  </div>
                  <p className="text-sm text-gray-200">{t(`vr.map.${m.key}.desc`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance advantage */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-purple-950/70 to-cyan-950/60 backdrop-blur-md border-purple-400/30">
          <CardHeader>
            <CardTitle className="text-white">{t('vr.perf.title')}</CardTitle>
            <p className="text-sm text-gray-300">{t('vr.perf.desc')}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {perf.map((p) => (
                <div key={p} className="text-center space-y-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {t(`vr.perf.${p}.val`)}
                  </div>
                  <div className="text-sm text-gray-200">{t(`vr.perf.${p}.label`)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tesla FSD compatibility */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-red-950/60 to-slate-900/80 backdrop-blur-md border-red-400/20">
          <CardHeader>
            <CardTitle className="text-red-100 flex items-center space-x-3">
              <Car className="w-6 h-6" />
              <span>{t('vr.fsd.title')}</span>
            </CardTitle>
            <p className="text-sm text-gray-200">{t('vr.fsd.desc')}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fsd.map((f) => (
                <div key={f.key} className="space-y-3 p-4 bg-slate-900/60 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2">
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                    <h4 className="font-semibold text-white">{t(`vr.fsd.${f.key}.title`)}</h4>
                  </div>
                  <p className="text-sm text-gray-200">{t(`vr.fsd.${f.key}.desc`)}</p>
                </div>
              ))}
            </div>
            <blockquote className="mt-6 text-center italic text-gray-100 leading-relaxed border-t border-white/10 pt-4">
              "{t('vr.fsd.verdict')}"
            </blockquote>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default VeraRubinSection;
