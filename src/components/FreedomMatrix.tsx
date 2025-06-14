
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, Shield, Zap, Users } from 'lucide-react';

const FreedomMatrix = () => {
  const freedomFeatures = [
    {
      title: "20%-Sicherheitsmarge",
      description: "Nutzer dürfen Geschwindigkeit ±20% und Position ±0,5m von der idealen Trajektorie abweichen",
      icon: Gauge,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Quantengestützte Echtzeit-Korrektur",
      description: "100x pro Sekunde passt das System die Sicherheitskorridore aller umliegenden Fahrzeuge an",
      icon: Zap,
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Psychohygiene-Features",
      description: "Adaptive Fahrtdauer mit automatischen Kontrollintervallen und Belohnungssystem",
      icon: Users,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Fail-Safe-Mechanismus",
      description: "Graduelles Übernehmen bei Überschreitung der Sicherheitsmarge mit haptischem Feedback",
      icon: Shield,
      color: "from-orange-600 to-red-600"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Die Freiheitsmatrix
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Individuelle Kontrolle im kollektiven System: Das Dual-Mode-Prinzip vereint 
          Sicherheit mit Selbstbestimmung durch Dynamische Freiheitszonen (DFZ).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {freedomFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full hover:bg-black/60 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-12"
      >
        <Card className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 backdrop-blur-md border-pink-400/30">
          <CardHeader>
            <CardTitle className="text-center text-pink-200">Dual-Mode-Prinzip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">Passive Pendler</h3>
                <p className="text-gray-300">Vollautonomer Modus - Fahrzeug agiert als reine City-Brain-Extension für maximale Effizienz</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Energieeffizienz</span>
                    <span className="text-sm text-green-400">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Stressreduktion</span>
                    <span className="text-sm text-green-400">95%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-pink-300">Aktive Steuermenschen</h3>
                <p className="text-gray-300">Dynamische Freiheitszone - Manuelles Eingreifen innerhalb physikalischer Sicherheitskorridore</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Kontrolle</span>
                    <span className="text-sm text-purple-400">±20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Sicherheit</span>
                    <span className="text-sm text-green-400">99,9%</span>
                  </div>
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
