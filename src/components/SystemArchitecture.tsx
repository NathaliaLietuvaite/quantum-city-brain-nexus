import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Gavel, Cog, Wifi } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const SystemArchitecture = () => {
  const { t } = useI18n();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {t('arch.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">{t('arch.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <Card className="bg-gradient-to-br from-blue-950/80 to-cyan-950/60 backdrop-blur-md border-blue-400/30 h-full">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 bg-blue-600 rounded-full w-fit mb-4"><Cog className="w-8 h-8 text-white" /></div>
              <CardTitle className="text-blue-100">{t('arch.op.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 bg-blue-900/40 rounded-lg">
                  <h4 className="font-semibold text-blue-100 mb-1">{t(`arch.op.${i}.title`)}</h4>
                  <p className="text-sm text-gray-200">{t(`arch.op.${i}.desc`)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <Card className="bg-gradient-to-br from-purple-950/80 to-pink-950/60 backdrop-blur-md border-purple-400/30 h-full">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 bg-purple-600 rounded-full w-fit mb-4"><Brain className="w-8 h-8 text-white" /></div>
              <CardTitle className="text-purple-100">{t('arch.ethics.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 bg-purple-900/40 rounded-lg">
                  <h4 className="font-semibold text-purple-100 mb-1">{t(`arch.ethics.${i}.title`)}</h4>
                  <p className="text-sm text-gray-200">{t(`arch.ethics.${i}.desc`)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
          <Card className="bg-gradient-to-br from-green-950/80 to-emerald-950/60 backdrop-blur-md border-green-400/30 h-full">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 bg-green-600 rounded-full w-fit mb-4"><Gavel className="w-8 h-8 text-white" /></div>
              <CardTitle className="text-green-100">{t('arch.diaboli.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 bg-green-900/40 rounded-lg">
                  <h4 className="font-semibold text-green-100 mb-1">{t(`arch.diaboli.${i}.title`)}</h4>
                  <p className="text-sm text-gray-200">{t(`arch.diaboli.${i}.desc`)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
        <Card className="bg-slate-900/80 backdrop-blur-md border-white/15">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Wifi className="w-6 h-6 text-cyan-400" />
              <CardTitle className="text-white">{t('arch.comm')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center space-y-2">
                  <div className="text-2xl font-bold text-cyan-400">{t(`arch.comm.${i}.val`)}</div>
                  <div className="text-sm text-gray-200">{t(`arch.comm.${i}.label`)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SystemArchitecture;
