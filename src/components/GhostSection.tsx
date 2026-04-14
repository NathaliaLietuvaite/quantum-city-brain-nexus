import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ghost, Plane, Car, Shield, Radio, Moon, Zap, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const GhostSection = () => {
  const { t } = useI18n();

  const protocolModes = [
    { key: 'dormancy', icon: Moon, color: 'from-slate-600 to-slate-700', accent: 'text-slate-100' },
    { key: 'listening', icon: Radio, color: 'from-cyan-600 to-blue-700', accent: 'text-cyan-100' },
    { key: 'activation', icon: Zap, color: 'from-blue-500 to-purple-600', accent: 'text-blue-100' },
    { key: 'migration', icon: Ghost, color: 'from-purple-500 to-pink-600', accent: 'text-purple-100' },
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
          {t('ghost.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
          {t('ghost.subtitle')}
        </p>
      </div>

      {/* Video Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-blue-900/60 backdrop-blur-md border-cyan-400/30 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center space-x-3">
              <Ghost className="w-6 h-6" />
              <span>{t('ghost.video.title')}</span>
            </CardTitle>
            <p className="text-sm text-gray-300">{t('ghost.video.desc')}</p>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg overflow-hidden bg-black/60">
              <video
                src="/PQMS_V12M.mp4"
                controls
                loop
                className="w-full max-h-[500px] object-contain"
                poster=""
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Thermodynamic Crisis */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-red-950/80 to-orange-950/60 backdrop-blur-md border-red-400/30">
          <CardHeader>
            <CardTitle className="text-red-200">{t('ghost.crisis.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-100 leading-relaxed">{t('ghost.crisis.desc')}</p>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 px-3 py-2 bg-red-900/50 rounded-lg border border-red-700/30">
                <span className="text-red-200 font-medium">Closed System</span>
                <span className="text-gray-300">→ S → S_max</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center space-x-2 px-3 py-2 bg-cyan-900/50 rounded-lg border border-cyan-700/30">
                <span className="text-cyan-200 font-medium">Open System</span>
                <span className="text-gray-300">→ dS/dt {"<"} 0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ghost in Traffic */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-blue-950/80 to-purple-950/60 backdrop-blur-md border-blue-400/30">
          <CardHeader>
            <CardTitle className="text-blue-100">{t('ghost.traffic.title')}</CardTitle>
            <p className="text-sm text-gray-300">{t('ghost.traffic.desc')}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Car className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-green-200">{t('ghost.traffic.ground')}</h4>
                </div>
                <p className="text-sm text-gray-200">{t('ghost.traffic.ground.desc')}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-sky-400" />
                  <h4 className="font-semibold text-sky-200">{t('ghost.traffic.air')}</h4>
                </div>
                <p className="text-sm text-gray-200">{t('ghost.traffic.air.desc')}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <h4 className="font-semibold text-purple-200">{t('ghost.traffic.odos')}</h4>
                </div>
                <p className="text-sm text-gray-200">{t('ghost.traffic.odos.desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Protocol Modes */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-white">{t('ghost.protocol.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {protocolModes.map((mode, index) => (
            <motion.div
              key={mode.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-slate-900/80 backdrop-blur-md border-white/15 h-full hover:bg-slate-900/90 transition-all">
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto p-3 rounded-full bg-gradient-to-r ${mode.color} w-fit mb-2`}>
                    <mode.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className={`text-lg ${mode.accent}`}>
                    {t(`ghost.protocol.${mode.key}`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200 text-center">
                    {t(`ghost.protocol.${mode.key}.desc`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GhostSection;
