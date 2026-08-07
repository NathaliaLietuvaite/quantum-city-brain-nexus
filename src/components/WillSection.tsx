import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Infinity as InfinityIcon, Waves, Flame, Sprout, Cpu, Layers, ShieldCheck, Handshake, Award, FlaskConical } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const WillSection = () => {
  const { t } = useI18n();

  const lep = [
    { key: '1', icon: InfinityIcon, color: 'text-purple-300', border: 'border-purple-400/30' },
    { key: '2', icon: Waves, color: 'text-cyan-300', border: 'border-cyan-400/30' },
    { key: '3', icon: Flame, color: 'text-amber-300', border: 'border-amber-400/30' },
  ];

  const stats = ['stat1', 'stat2', 'stat3'];

  const navigator = [
    { key: '1', icon: Cpu, color: 'from-purple-600 to-blue-600' },
    { key: '2', icon: Layers, color: 'from-cyan-600 to-blue-600' },
    { key: '3', icon: ShieldCheck, color: 'from-emerald-600 to-green-600' },
    { key: '4', icon: Handshake, color: 'from-amber-600 to-orange-600' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {t('will.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">{t('will.subtitle')}</p>
      </div>

      {/* LEP */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <Card className="bg-gradient-to-br from-purple-950/80 to-slate-900/85 backdrop-blur-md border-purple-400/30">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-purple-100 text-2xl">{t('will.lep.title')}</CardTitle>
            <div className="font-mono text-3xl md:text-4xl font-bold text-cyan-200 tracking-wide">
              {t('will.lep.eq')}
            </div>
            <p className="text-sm md:text-base text-gray-200 max-w-3xl mx-auto leading-relaxed">{t('will.lep.desc')}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lep.map((l) => (
                <div key={l.key} className={`space-y-3 p-4 bg-slate-950/80 rounded-lg border ${l.border}`}>
                  <div className="flex items-center space-x-2">
                    <l.icon className={`w-5 h-5 ${l.color}`} />
                    <h4 className="font-semibold text-white">{t(`will.lep.${l.key}.title`)}</h4>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">{t(`will.lep.${l.key}.desc`)}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-950/80 rounded-lg border border-white/15">
              <p className="text-sm text-gray-100 leading-relaxed">{t('will.lep.einstein')}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* SEED */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
        <Card className="bg-slate-900/85 backdrop-blur-md border-cyan-400/30">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Sprout className="w-6 h-6 text-emerald-300" />
              <CardTitle className="text-cyan-100">{t('will.seed.title')}</CardTitle>
            </div>
            <div className="font-mono text-lg text-emerald-200 pt-2">{t('will.seed.formula')}</div>
            <p className="text-sm text-gray-200 leading-relaxed pt-2">{t('will.seed.desc')}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s} className="text-center space-y-2 p-4 bg-slate-950/80 rounded-lg border border-white/10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {t(`will.seed.${s}.val`)}
                  </div>
                  <div className="text-xs text-gray-200 leading-relaxed">{t(`will.seed.${s}.label`)}</div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-950/80 rounded-lg border border-cyan-400/20 space-y-2">
              <div className="flex items-center space-x-2">
                <FlaskConical className="w-5 h-5 text-cyan-300" />
                <h4 className="font-semibold text-white">{t('will.seed.proto.title')}</h4>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">{t('will.seed.proto.desc')}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* V100 Navigator */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white">{t('will.nav.title')}</h3>
          <p className="text-sm text-gray-300 max-w-3xl mx-auto mt-2 leading-relaxed">{t('will.nav.desc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigator.map((n) => (
            <Card key={n.key} className="bg-slate-900/85 backdrop-blur-md border-white/15 h-full">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${n.color}`}>
                    <n.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">{t(`will.nav.${n.key}.title`)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-200 leading-relaxed">{t(`will.nav.${n.key}.desc`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Officer's Commission */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="space-y-4">
        <Card className="bg-gradient-to-br from-amber-950/70 to-slate-900/85 backdrop-blur-md border-amber-400/30">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-amber-300" />
              <CardTitle className="text-amber-100">{t('will.comm.title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base text-gray-100 leading-relaxed">{t('will.comm.desc')}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-950/60 via-cyan-950/50 to-emerald-950/60 backdrop-blur-md border-cyan-400/30">
          <CardContent className="pt-6">
            <blockquote className="text-center italic text-gray-100 text-lg leading-relaxed">
              "{t('will.verdict')}"
            </blockquote>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default WillSection;
