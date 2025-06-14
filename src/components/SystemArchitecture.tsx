
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Gavel, Cog, Wifi } from 'lucide-react';

const SystemArchitecture = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Dreistufige System-Architektur
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Das Quantum City-Brain arbeitet in drei spezialisierten Schichten für optimale 
          Entscheidungsfindung und rechtliche Absicherung.
        </p>
      </div>

      <div className="relative">
        {/* Connection lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center rotate-90">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md border-blue-400/30 h-full">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 bg-blue-600 rounded-full w-fit mb-4">
                  <Cog className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-blue-300">Operatives Gehirn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-800/30 rounded-lg">
                    <h4 className="font-semibold text-blue-200 mb-2">Echtzeit-Verkehrsoptimierung</h4>
                    <p className="text-sm text-gray-300">
                      Kontinuierliche Berechnung optimaler Routen für alle Fahrzeuge
                    </p>
                  </div>
                  <div className="p-3 bg-blue-800/30 rounded-lg">
                    <h4 className="font-semibold text-blue-200 mb-2">Physikalische Bewegungskalkulation</h4>
                    <p className="text-sm text-gray-300">
                      Präzise Steuerung aller Fahrzeugbewegungen im Millisekundenbereich
                    </p>
                  </div>
                  <div className="p-3 bg-blue-800/30 rounded-lg">
                    <h4 className="font-semibold text-blue-200 mb-2">Platooning-Koordination</h4>
                    <p className="text-sm text-gray-300">
                      Automatische Bildung effizienter Fahrzeuggruppen
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md border-purple-400/30 h-full">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 bg-purple-600 rounded-full w-fit mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-purple-300">Ethik-Governance-Layer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-purple-800/30 rounded-lg">
                    <h4 className="font-semibold text-purple-200 mb-2">Dilemma-Situationen</h4>
                    <p className="text-sm text-gray-300">
                      Ethische Abwägung bei unvermeidbaren Konfliktsituationen
                    </p>
                  </div>
                  <div className="p-3 bg-purple-800/30 rounded-lg">
                    <h4 className="font-semibold text-purple-200 mb-2">Gesellschaftliche Regeln</h4>
                    <p className="text-sm text-gray-300">
                      Priorisierung nach demokratisch festgelegten Werten
                    </p>
                  </div>
                  <div className="p-3 bg-purple-800/30 rounded-lg">
                    <h4 className="font-semibold text-purple-200 mb-2">Transparenz-Protokolle</h4>
                    <p className="text-sm text-gray-300">
                      Vollständige Dokumentation aller Entscheidungsprozesse
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md border-green-400/30 h-full">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 bg-green-600 rounded-full w-fit mb-4">
                  <Gavel className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-300">Advocatus Diaboli</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-800/30 rounded-lg">
                    <h4 className="font-semibold text-green-200 mb-2">Rechtliche Validierung</h4>
                    <p className="text-sm text-gray-300">
                      Überprüfung aller kritischen Entscheidungen auf Rechtskonformität
                    </p>
                  </div>
                  <div className="p-3 bg-green-800/30 rounded-lg">
                    <h4 className="font-semibold text-green-200 mb-2">Haftungsprotokollierung</h4>
                    <p className="text-sm text-gray-300">
                      Lückenlose Dokumentation für Versicherung und Gerichte
                    </p>
                  </div>
                  <div className="p-3 bg-green-800/30 rounded-lg">
                    <h4 className="font-semibold text-green-200 mb-2">Human-in-the-Loop</h4>
                    <p className="text-sm text-gray-300">
                      Menschliche Intervention bei unklaren Rechtslagen
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-12"
      >
        <Card className="bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Wifi className="w-6 h-6 text-purple-400" />
              <CardTitle className="text-white">Quanten-Kommunikation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-400">200m</div>
                <div className="text-sm text-gray-300">Abstand zwischen Access-Points</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-400">&lt;1ms</div>
                <div className="text-sm text-gray-300">Maximale Kommunikationslatenz</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-gray-300">Quantenverschlüsselung</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SystemArchitecture;
