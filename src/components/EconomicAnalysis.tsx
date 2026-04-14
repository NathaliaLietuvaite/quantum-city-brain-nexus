import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Euro, Calculator, Target } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const EconomicAnalysis = () => {
  const { t } = useI18n();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          {t('econ.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">{t('econ.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <Card className="bg-slate-900/80 backdrop-blur-md border-white/15 h-full">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600"><Euro className="w-6 h-6 text-white" /></div>
                <div>
                  <CardTitle className="text-white">{t('econ.savings')}</CardTitle>
                  <div className="text-3xl font-bold text-green-300">{t('econ.savings.amount')}</div>
                  <p className="text-gray-300 text-sm">{t('econ.savings.desc')}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center p-2 bg-white/10 rounded">
                    <span className="text-gray-200">{t(`econ.savings.${i}`)}</span>
                    <span className="font-semibold text-white">{t(`econ.savings.${i}.val`)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <Card className="bg-slate-900/80 backdrop-blur-md border-white/15 h-full">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600"><Euro className="w-6 h-6 text-white" /></div>
                <div>
                  <CardTitle className="text-white">{t('econ.investment')}</CardTitle>
                  <div className="text-3xl font-bold text-blue-300">{t('econ.investment.amount')}</div>
                  <p className="text-gray-300 text-sm">{t('econ.investment.desc')}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center p-2 bg-white/10 rounded">
                    <span className="text-gray-200">{t(`econ.investment.${i}`)}</span>
                    <span className="font-semibold text-white">{t(`econ.investment.${i}.val`)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-950/70 to-pink-950/50 backdrop-blur-md border-purple-400/30">
          <CardHeader className="text-center"><TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" /><CardTitle className="text-purple-100">{t('econ.rof')}</CardTitle></CardHeader>
          <CardContent className="text-center"><div className="text-4xl font-bold text-purple-200">{t('econ.rof.val')}</div><p className="text-sm text-gray-200 mt-2">{t('econ.rof.desc')}</p></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-950/70 to-emerald-950/50 backdrop-blur-md border-green-400/30">
          <CardHeader className="text-center"><Calculator className="w-8 h-8 text-green-400 mx-auto mb-2" /><CardTitle className="text-green-100">{t('econ.amort')}</CardTitle></CardHeader>
          <CardContent className="text-center"><div className="text-4xl font-bold text-green-200">{t('econ.amort.val')}</div><p className="text-sm text-gray-200 mt-2">{t('econ.amort.desc')}</p></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-950/70 to-cyan-950/50 backdrop-blur-md border-blue-400/30">
          <CardHeader className="text-center"><Target className="w-8 h-8 text-blue-400 mx-auto mb-2" /><CardTitle className="text-blue-100">{t('econ.vehicle')}</CardTitle></CardHeader>
          <CardContent className="text-center"><div className="text-4xl font-bold text-blue-200">{t('econ.vehicle.val')}</div><p className="text-sm text-gray-200 mt-2">{t('econ.vehicle.desc')}</p></CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
        <Card className="bg-slate-900/80 backdrop-blur-md border-white/15">
          <CardHeader><CardTitle className="text-center text-white">{t('econ.social')}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2"><div className="text-2xl font-bold text-red-400">99.9%</div><div className="text-sm text-gray-200">{t('econ.social.1')}</div></div>
              <div className="space-y-2"><div className="text-2xl font-bold text-green-400">40%+</div><div className="text-sm text-gray-200">{t('econ.social.2')}</div></div>
              <div className="space-y-2"><div className="text-2xl font-bold text-blue-400">95%</div><div className="text-sm text-gray-200">{t('econ.social.3')}</div></div>
              <div className="space-y-2"><div className="text-2xl font-bold text-purple-400">100%</div><div className="text-sm text-gray-200">{t('econ.social.4')}</div></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EconomicAnalysis;
