import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Cpu, Shield, Zap, Network } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const QuantumFoundation = () => {
  const { t } = useI18n();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {t('quantum.title')}
        </h2>
        <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">{t('quantum.subtitle')}</p>
      </div>

      {/* Main Card */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
        <Card className="bg-gradient-to-r from-blue-900/40 to-cyan-900/30 backdrop-blur-md border-cyan-400/20">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-cyan-200 flex items-center space-x-3">
                <Network className="w-6 h-6" />
                <span>{t('quantum.project')}</span>
              </CardTitle>
              <a
                href="https://github.com/NathaliaLietuvaite/Quantenkommunikation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('quantum.repo')}</span>
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cyan-300">{t('quantum.core')}</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Cpu className="w-5 h-5 text-cyan-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-cyan-200">{t('quantum.core.rpu')}</h4>
                      <p className="text-sm text-gray-400">{t('quantum.core.rpu.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-purple-200">{t('quantum.core.odos')}</h4>
                      <p className="text-sm text-gray-400">{t('quantum.core.odos.desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-yellow-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-yellow-200">{t('quantum.core.littlevector')}</h4>
                      <p className="text-sm text-gray-400">{t('quantum.core.littlevector.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">{t('quantum.traffic')}</h3>
                <div className="space-y-3">
                  {['qap', 'rt', 'fs'].map(k => (
                    <div key={k} className="p-3 bg-blue-800/20 rounded-lg">
                      <h4 className="font-medium text-blue-200 mb-1">{t(`quantum.traffic.${k}`)}</h4>
                      <p className="text-sm text-gray-400">{t(`quantum.traffic.${k}.desc`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
          <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full">
            <CardHeader><CardTitle className="text-cyan-300 text-center">{t('quantum.specs')}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {['qubits', 'latency', 'qber', 'range'].map(k => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-400">{t(`quantum.specs.${k}`)}</span>
                  <span className="text-cyan-400 font-mono">{t(`quantum.specs.${k}.val`)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
          <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full">
            <CardHeader><CardTitle className="text-purple-300 text-center">{t('quantum.security')}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-300">{t(`quantum.security.${i}`)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.6 }}>
          <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full">
            <CardHeader><CardTitle className="text-yellow-300 text-center">{t('quantum.research')}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-400">Principal Investigator:</div>
              <div className="text-yellow-200 font-medium">{t('quantum.research.author')}</div>
              <div className="text-xs text-gray-500 mt-2">{t('quantum.research.desc')}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuantumFoundation;
