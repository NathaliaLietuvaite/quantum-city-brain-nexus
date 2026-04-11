import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Brain, Shield, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ConceptOverview = () => {
  const { t } = useI18n();

  const concepts = [
    {
      icon: Car,
      titleKey: 'overview.c1.title',
      descKey: 'overview.c1.desc',
      features: ['overview.c1.f1', 'overview.c1.f2', 'overview.c1.f3', 'overview.c1.f4'],
      color: 'from-cyan-600 to-blue-600'
    },
    {
      icon: Brain,
      titleKey: 'overview.c2.title',
      descKey: 'overview.c2.desc',
      features: ['overview.c2.f1', 'overview.c2.f2', 'overview.c2.f3', 'overview.c2.f4'],
      color: 'from-blue-600 to-purple-600'
    },
    {
      icon: Shield,
      titleKey: 'overview.c3.title',
      descKey: 'overview.c3.desc',
      features: ['overview.c3.f1', 'overview.c3.f2', 'overview.c3.f3', 'overview.c3.f4'],
      color: 'from-green-600 to-emerald-600'
    },
    {
      icon: Users,
      titleKey: 'overview.c4.title',
      descKey: 'overview.c4.desc',
      features: ['overview.c4.f1', 'overview.c4.f2', 'overview.c4.f3', 'overview.c4.f4'],
      color: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {t('overview.title')}
        </h2>
        <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">{t('overview.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <motion.div key={concept.titleKey} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15, duration: 0.6 }}>
            <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full hover:bg-black/60 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${concept.color}`}>
                    <concept.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{t(concept.titleKey)}</CardTitle>
                    <CardDescription className="text-gray-300">{t(concept.descKey)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {concept.features.map((fKey) => (
                    <li key={fKey} className="flex items-start space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{t(fKey)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ConceptOverview;
