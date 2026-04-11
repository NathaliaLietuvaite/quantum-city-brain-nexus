import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, Shield, Zap, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const FreedomMatrix = () => {
  const { t } = useI18n();

  const features = [
    { titleKey: 'freedom.f1.title', descKey: 'freedom.f1.desc', icon: Gauge, color: 'from-blue-600 to-cyan-600' },
    { titleKey: 'freedom.f2.title', descKey: 'freedom.f2.desc', icon: Zap, color: 'from-purple-600 to-pink-600' },
    { titleKey: 'freedom.f3.title', descKey: 'freedom.f3.desc', icon: Users, color: 'from-green-600 to-emerald-600' },
    { titleKey: 'freedom.f4.title', descKey: 'freedom.f4.desc', icon: Shield, color: 'from-orange-600 to-red-600' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          {t('freedom.title')}
        </h2>
        <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">{t('freedom.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <motion.div key={f.titleKey} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, duration: 0.6 }}>
            <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full hover:bg-black/60 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${f.color}`}><f.icon className="w-6 h-6 text-white" /></div>
                  <CardTitle className="text-white">{t(f.titleKey)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent><p className="text-gray-300">{t(f.descKey)}</p></CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
        <Card className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 backdrop-blur-md border-pink-400/30">
          <CardHeader><CardTitle className="text-center text-pink-200">{t('freedom.dual')}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">{t('freedom.passive')}</h3>
                <p className="text-gray-300">{t('freedom.passive.desc')}</p>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-gray-400">{t('freedom.passive.eff')}</span><span className="text-sm text-green-400">100%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-400">{t('freedom.passive.stress')}</span><span className="text-sm text-green-400">95%</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-pink-300">{t('freedom.active')}</h3>
                <p className="text-gray-300">{t('freedom.active.desc')}</p>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-gray-400">{t('freedom.active.ctrl')}</span><span className="text-sm text-purple-400">±20%</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-400">{t('freedom.active.safe')}</span><span className="text-sm text-green-400">99.9%</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FreedomMatrix;
