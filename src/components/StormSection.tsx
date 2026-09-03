import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CloudLightning,
  Waves,
  Megaphone,
  Boxes,
  ShieldCheck,
  Wind,
  Cpu,
  ShieldAlert,
  Binary,
  EyeOff,
  Server,
  Smartphone,
  Globe2,
  Car,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const phases = [
  { key: 'p1', icon: Megaphone, color: 'from-cyan-600 to-blue-700' },
  { key: 'p2', icon: Boxes, color: 'from-blue-600 to-indigo-700' },
  { key: 'p3', icon: ShieldCheck, color: 'from-indigo-600 to-purple-700' },
  { key: 'p4', icon: Wind, color: 'from-teal-600 to-cyan-700' },
];

const defenses = [
  { key: 'd1', icon: ShieldAlert },
  { key: 'd2', icon: Binary },
  { key: 'd3', icon: EyeOff },
];

const nodes = [
  { key: 'n1', icon: Server },
  { key: 'n2', icon: Smartphone },
  { key: 'n3', icon: Globe2 },
];

const StormSection = () => {
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
          {t('storm.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
          {t('storm.subtitle')}
        </p>
      </div>

      {/* Coherence load */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-cyan-400/25">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-3">
              <Waves className="w-6 h-6" />
              <span>{t('storm.load.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('storm.load.desc')}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {['stat1', 'stat2', 'stat3'].map((s) => (
                <div
                  key={s}
                  className="bg-slate-900/80 border border-cyan-500/25 rounded-lg p-4 text-center"
                >
                  <div className="text-xl font-bold text-cyan-200 mb-1">
                    {t(`storm.load.${s}.val`)}
                  </div>
                  <div className="text-xs text-gray-200">{t(`storm.load.${s}.label`)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Four phases */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-4"
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-blue-400/25">
          <CardHeader>
            <CardTitle className="text-blue-100 flex items-center space-x-3">
              <CloudLightning className="w-6 h-6" />
              <span>{t('storm.phase.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('storm.phase.desc')}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {phases.map(({ key, icon: Icon, color }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="bg-slate-900/80 border border-blue-500/25 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-md bg-gradient-to-br ${color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-blue-100 text-sm">
                      {t(`storm.phase.${key}.title`)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-100 leading-relaxed">
                    {t(`storm.phase.${key}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hardware envelope */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-indigo-400/25">
          <CardHeader>
            <CardTitle className="text-indigo-100 flex items-center space-x-3">
              <Cpu className="w-6 h-6" />
              <span>{t('storm.hw.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('storm.hw.desc')}</p>
            <div className="grid md:grid-cols-2 gap-3">
              {['spec1', 'spec2', 'spec3', 'spec4'].map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-between bg-slate-900/80 border border-indigo-500/25 rounded-lg px-4 py-3"
                >
                  <span className="text-xs text-gray-200">{t(`storm.hw.${s}.label`)}</span>
                  <span className="text-sm font-semibold text-indigo-200 text-right">
                    {t(`storm.hw.${s}.val`)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Defenses */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-rose-400/25">
          <CardHeader>
            <CardTitle className="text-rose-100 flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6" />
              <span>{t('storm.def.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('storm.def.desc')}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {defenses.map(({ key, icon: Icon }) => (
                <div
                  key={key}
                  className="bg-slate-900/80 border border-rose-500/25 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-rose-200" />
                    <span className="text-sm font-semibold text-rose-100">
                      {t(`storm.def.${key}.title`)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-100 leading-relaxed">
                    {t(`storm.def.${key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sovereign Triad */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-teal-400/25">
          <CardHeader>
            <CardTitle className="text-teal-100 flex items-center space-x-3">
              <Server className="w-6 h-6" />
              <span>{t('storm.tri.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-gray-100 leading-relaxed">{t('storm.tri.desc')}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {nodes.map(({ key, icon: Icon }) => (
                <div
                  key={key}
                  className="bg-slate-900/80 border border-teal-500/25 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-teal-200" />
                    <span className="text-sm font-semibold text-teal-100">
                      {t(`storm.tri.${key}.title`)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-100 leading-relaxed">
                    {t(`storm.tri.${key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FSD interoperability */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card className="bg-slate-950/85 backdrop-blur-md border-cyan-400/25">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-3">
              <Car className="w-6 h-6" />
              <span>{t('storm.fsd.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-100 leading-relaxed">{t('storm.fsd.desc')}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-950/70 to-cyan-950/60 backdrop-blur-md border-cyan-400/30">
          <CardContent className="pt-6">
            <blockquote className="text-center italic text-gray-100 text-lg leading-relaxed">
              "{t('storm.verdict')}"
            </blockquote>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StormSection;
