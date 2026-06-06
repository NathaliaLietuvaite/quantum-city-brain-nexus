import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lock, Activity, Cpu, Layers, ShieldCheck, GitMerge, DollarSign, Sparkles, Unlock } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const N3USection = () => {
  const { t } = useI18n();

  const cards = [
    { key: 'nemotron', icon: Brain, color: 'from-cyan-600 to-blue-600' },
    { key: 'bluefield', icon: Lock, color: 'from-emerald-600 to-green-600' },
    { key: 'power', icon: Activity, color: 'from-amber-600 to-orange-600' },
    { key: 'vera', icon: Cpu, color: 'from-purple-600 to-blue-600' },
  ];

  const redundancy = [
    { key: 'r1', icon: Layers, color: 'text-cyan-300' },
    { key: 'r2', icon: ShieldCheck, color: 'text-emerald-300' },
    { key: 'r3', icon: GitMerge, color: 'text-blue-300' },
  ];

  const stats = ['stat1', 'stat2', 'stat3'];

  const magnet = [
    { key: 'money', icon: DollarSign, color: 'text-emerald-300', border: 'border-emerald-400/30' },
    { key: 'tech', icon: Sparkles, color: 'text-cyan-300', border: 'border-cyan-400/30' },
    { key: 'open', icon: Unlock, color: 'text-purple-300', border: 'border-purple-400/30' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-10"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
          {t('n3u.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
          {t('n3u.subtitle')}
        </p>
      </div>

      {/* Sovereign substrate cards */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white">{t('n3u.sub.title')}</h3>
          <p className="text-sm text-gray-300 max-w-3xl mx-auto mt-2">{t('n3u.sub.desc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((c, index) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-slate-900/80 backdrop-blur-md border-white/15 h-full hover:bg-slate-900/90 transition-all">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${c.color}`}>
                      <c.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{t(`n3u.card.${c.key}.title`)}</CardTitle>
                      <span className="text-xs text-cyan-300">{t(`n3u.card.${c.key}.tag`)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200">{t(`n3u.card.${c.key}.desc`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Redundant traffic-space mapping */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-blue-950/80 to-slate-900/80 backdrop-blur-md border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-cyan-100">{t('n3u.red.title')}</CardTitle>
            <p className="text-sm text-gray-200">{t('n3u.red.desc')}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {redundancy.map((r) => (
                <div key={r.key} className="space-y-3 p-4 bg-slate-900/60 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2">
                    <r.icon className={`w-5 h-5 ${r.color}`} />
                    <h4 className="font-semibold text-white">{t(`n3u.red.${r.key}.title`)}</h4>
                  </div>
                  <p className="text-sm text-gray-200">{t(`n3u.red.${r.key}.desc`)}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {stats.map((s) => (
                <div key={s} className="text-center space-y-1">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    {t(`n3u.red.${s}.val`)}
                  </div>
                  <div className="text-xs text-gray-200">{t(`n3u.red.${s}.label`)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* The Musk magnet */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {t('n3u.magnet.title')}
          </h3>
          <p className="text-sm text-gray-300 max-w-3xl mx-auto mt-2">{t('n3u.magnet.desc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {magnet.map((m) => (
            <div key={m.key} className={`space-y-3 p-5 bg-slate-900/80 rounded-lg border ${m.border}`}>
              <div className="flex items-center space-x-2">
                <m.icon className={`w-5 h-5 ${m.color}`} />
                <h4 className="font-bold text-white">{t(`n3u.magnet.${m.key}.title`)}</h4>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">{t(`n3u.magnet.${m.key}.desc`)}</p>
            </div>
          ))}
        </div>
        <Card className="bg-gradient-to-r from-emerald-950/60 via-cyan-950/50 to-purple-950/60 backdrop-blur-md border-cyan-400/30">
          <CardContent className="pt-6">
            <blockquote className="text-center italic text-gray-100 text-lg leading-relaxed">
              "{t('n3u.magnet.verdict')}"
            </blockquote>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default N3USection;
