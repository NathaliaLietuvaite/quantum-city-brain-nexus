import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';

const dimensions = [
  'intelligence', 'coordination', 'ethics', 'entropy',
  'platoon', 'aerial', 'privacy', 'cost'
];

const ComparisonSection = () => {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          {t('comp.title')}
        </h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed">
          {t('comp.subtitle')}
        </p>
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 gap-4 text-center">
        <div />
        <div className="col-span-2">
          <div className="bg-red-950/60 border border-red-500/40 rounded-lg px-4 py-3">
            <div className="text-red-200 font-bold">{t('comp.fsd')}</div>
            <div className="text-red-300/80 text-xs">{t('comp.fsd.subtitle')}</div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-cyan-950/60 border border-cyan-500/40 rounded-lg px-4 py-3">
            <div className="text-cyan-200 font-bold">{t('comp.ghost')}</div>
            <div className="text-cyan-300/80 text-xs">{t('comp.ghost.subtitle')}</div>
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-3">
        {dimensions.map((dim, index) => (
          <motion.div
            key={dim}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
          >
            <div className="grid grid-cols-5 gap-4 items-stretch">
              <div className="flex items-center justify-end pr-2">
                <span className="text-sm font-semibold text-gray-100 text-right">
                  {t(`comp.dim.${dim}`)}
                </span>
              </div>
              <div className="col-span-2">
                <div className="h-full bg-red-950/40 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs text-red-100">{t(`comp.dim.${dim}.fsd`)}</p>
                </div>
              </div>
              <div className="col-span-2">
                <div className="h-full bg-cyan-950/40 border border-cyan-500/20 rounded-lg p-3">
                  <p className="text-xs text-cyan-100">{t(`comp.dim.${dim}.ghost`)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-purple-950/60 to-cyan-950/50 backdrop-blur-md border-purple-400/30">
          <CardContent className="pt-6">
            <blockquote className="text-center italic text-gray-100 text-lg leading-relaxed">
              "{t('comp.verdict')}"
            </blockquote>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ComparisonSection;
