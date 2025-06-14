
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, Users, Shield } from 'lucide-react';

const TransitionStrategy = () => {
  const phases = [
    {
      phase: "Phase 1: Inselmodell",
      duration: "Jahr 0–5",
      progress: 100,
      icon: MapPin,
      color: "from-blue-600 to-cyan-600",
      features: [
        "Quanten-Access-Points auf Autobahnen",
        "City-Brains als regionale Verkehrsinseln",
        "Dual-Mode-Fahrzeuge mit reduzierter Onboard-Intelligenz",
        "Notlink-Pflicht für alle Neufahrzeuge"
      ]
    },
    {
      phase: "Phase 2: Korridornetzung",
      duration: "Jahr 5–10",
      progress: 60,
      icon: Users,
      color: "from-purple-600 to-pink-600",
      features: [
        "Access-Points in Städten >100.000 Einwohner",
        "Nationale Quanten-Verkehrskorridore",
        "Reine Sensor/Aktor-Fahrzeuge (50% Kosteneinsparung)",
        "Advocatus Diaboli als gesetzliche Instanz"
      ]
    },
    {
      phase: "Phase 3: Vollintegration",
      duration: "ab Jahr 10+",
      progress: 20,
      icon: Shield,
      color: "from-green-600 to-emerald-600",
      features: [
        "Flächendeckende Abdeckung",
        "Drei unabhängige City-Brains pro Region",
        "Reine 'Vehicular Tools' ohne Steuerungselemente",
        "99,9% Unfallreduktion durch Pflichtbetrieb"
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
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Übergangsstrategie
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Der stufenweise Weg in die neue Ära: Eine hybride Koexistenzphase von 10–15 Jahren
          vermeidet disruptive Brüche durch drei abgestufte Evolutionsstufen.
        </p>
      </div>

      <div className="space-y-8">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3, duration: 0.6 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${phase.color}`}>
                      <phase.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{phase.phase}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">{phase.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{phase.progress}%</div>
                    <div className="text-sm text-gray-400">Fortschritt</div>
                  </div>
                </div>
                <Progress value={phase.progress} className="mt-4" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
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
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-12"
      >
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border-purple-400/30">
          <CardHeader>
            <CardTitle className="text-center text-purple-200">Wirtschaftliche Bilanz des Übergangs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-300">88 Mrd. €</div>
                <div className="text-sm text-gray-300">Gesamtinvestition über 15 Jahre (Deutschland)</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-300">21,5 Mrd. €</div>
                <div className="text-sm text-gray-300">Jährliche Einsparungen ab Phase 3</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-300">6,2 Jahre</div>
                <div className="text-sm text-gray-300">ROI nach Vollbetrieb</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TransitionStrategy;
