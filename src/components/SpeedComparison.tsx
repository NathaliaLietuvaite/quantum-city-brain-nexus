
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Gauge, Battery, Users } from 'lucide-react';

const SpeedComparison = () => {
  const speedScenarios = [
    {
      speed: "130 km/h",
      description: "Maximale Defragmentierung",
      icon: Users,
      color: "from-green-600 to-emerald-600",
      metrics: {
        vehicles: "119 Fahrzeuge/km",
        consumption: "12 kWh/100km",
        defragmentation: "94%",
        capacity: "21.420 Fzg/h"
      },
      advantages: [
        "Platoons mit 5cm Abstand",
        "60% Luftwiderstandsreduktion",
        "Optimale Energieeffizienz",
        "Maximale Verkehrskapazität"
      ]
    },
    {
      speed: "250 km/h",
      description: "Premium-Geschwindigkeit",
      icon: Zap,
      color: "from-purple-600 to-pink-600",
      metrics: {
        vehicles: "32 Fahrzeuge/km",
        consumption: "21 kWh/100km",
        defragmentation: "63%",
        capacity: "12.480 Fzg/h"
      },
      advantages: [
        "50% kürzere Reisezeit",
        "81% Rekuperationsquote",
        "Premium-Service verfügbar",
        "Spezialausgebaute Korridore"
      ]
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
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Geschwindigkeitsvergleich
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Detaillierte Analyse der Autobahn-Defragmentierung bei verschiedenen 
          Geschwindigkeiten im DFZ-Modus mit Sicherheitsmargen und Energieeffizienz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {speedScenarios.map((scenario, index) => (
          <motion.div
            key={scenario.speed}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3, duration: 0.6 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${scenario.color}`}>
                    <scenario.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-2xl">{scenario.speed}</CardTitle>
                    <p className="text-gray-400">{scenario.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(scenario.metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-white/5 rounded">
                      <div className="text-lg font-bold text-white">{value}</div>
                      <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Vorteile:</h4>
                  {scenario.advantages.map((advantage, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{advantage}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-12"
      >
        <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 backdrop-blur-md border-yellow-400/30">
          <CardHeader>
            <CardTitle className="text-center text-yellow-200">Dynamische Geschwindigkeitszonen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  Adaptive 130/250-Segmente basierend auf Verkehrsdichte und Infrastruktur
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <div className="px-3 py-1 bg-green-600/30 rounded">130 km/h Zone</div>
                  <span className="text-gray-400">→</span>
                  <div className="px-3 py-1 bg-purple-600/30 rounded">250 km/h Korridor</div>
                  <span className="text-gray-400">→</span>
                  <div className="px-3 py-1 bg-green-600/30 rounded">130 km/h Zone</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <Gauge className="w-8 h-8 text-yellow-400 mx-auto" />
                  <div className="text-lg font-bold text-yellow-300">Quanten-Predictive-Control</div>
                  <p className="text-sm text-gray-300">5 min Vorausberechnung für sichere 250 km/h Freigabe</p>
                </div>
                <div className="text-center space-y-2">
                  <Battery className="w-8 h-8 text-green-400 mx-auto" />
                  <div className="text-lg font-bold text-green-300">Energiemanagement</div>
                  <p className="text-sm text-gray-300">Solarfahrbahn + Induktionsladung auf Schnellstrecken</p>
                </div>
                <div className="text-center space-y-2">
                  <Zap className="w-8 h-8 text-purple-400 mx-auto" />
                  <div className="text-lg font-bold text-purple-300">DFZ-Autoadjust</div>
                  <p className="text-sm text-gray-300">Reduzierter Freiheitskorridor (±10%) bei 250 km/h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8"
      >
        <Card className="bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-center text-white">Reisezeit Berlin–München</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <div className="space-y-4">
                <div className="text-3xl font-bold text-green-400">3:10 h</div>
                <div className="text-lg text-green-300">130 km/h System</div>
                <p className="text-sm text-gray-300">Maximale Effizienz und Kapazität</p>
              </div>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-purple-400">1:38 h</div>
                <div className="text-lg text-purple-300">250 km/h Premium</div>
                <p className="text-sm text-gray-300">50% Zeitersparnis mit Aufpreis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SpeedComparison;
