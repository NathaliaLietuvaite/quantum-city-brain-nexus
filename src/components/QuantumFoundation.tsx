
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Cpu, Shield, Zap, Network } from 'lucide-react';

const QuantumFoundation = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Quantenkommunikations-Fundament
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Das Quantum City-Brain basiert auf fortschrittlicher Quantenkommunikationstechnologie 
          aus dem übergeordneten Forschungsprojekt von Nathalia Lietuvaite.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 backdrop-blur-md border-purple-400/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-200 flex items-center space-x-3">
                <Network className="w-6 h-6" />
                <span>Quantenkommunikations-Projekt</span>
              </CardTitle>
              <a 
                href="https://github.com/NathaliaLietuvaite/Quantenkommunikation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cyan-300">Kernkomponenten</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Cpu className="w-5 h-5 text-cyan-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-cyan-200">Quantenprozessoren</h4>
                      <p className="text-sm text-gray-400">Basis für die dreistufige Brain-Architektur</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-purple-200">Quantenkryptografie</h4>
                      <p className="text-sm text-gray-400">Unknackbare Fahrzeug-zu-Brain Kommunikation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-yellow-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-yellow-200">Quantenverschränkung</h4>
                      <p className="text-sm text-gray-400">Instantane Datensynchronisation ohne Latenz</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">Verkehrsanwendung</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-800/30 rounded-lg">
                    <h4 className="font-medium text-purple-200 mb-1">Quanten-Access-Points</h4>
                    <p className="text-sm text-gray-400">Alle 200m im Stadtgebiet für lückenlose Verbindung</p>
                  </div>
                  <div className="p-3 bg-cyan-800/30 rounded-lg">
                    <h4 className="font-medium text-cyan-200 mb-1">Echtzeit-Koordination</h4>
                    <p className="text-sm text-gray-400">Simultane Steuerung aller Fahrzeuge im Millisekundenbereich</p>
                  </div>
                  <div className="p-3 bg-yellow-800/30 rounded-lg">
                    <h4 className="font-medium text-yellow-200 mb-1">Fail-Safe-Redundanz</h4>
                    <p className="text-sm text-gray-400">Quantenverschränkte Backup-Systeme in jedem Fahrzeug</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-cyan-300 text-center">Technische Spezifikationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Quantenbits (Qubits)</span>
                <span className="text-cyan-400">1024+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kohärenzzeit</span>
                <span className="text-cyan-400">100ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fehlerrate</span>
                <span className="text-cyan-400">&lt;0.001%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reichweite</span>
                <span className="text-cyan-400">500km</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-purple-300 text-center">Sicherheitsmerkmale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Quantenschlüssel-Verteilung</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Manipulationsdetektion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Perfect Forward Secrecy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Post-Quantum-Kryptografie</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-yellow-300 text-center">Forschungsstand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Entwicklung von:</div>
                <div className="text-yellow-200 font-medium">Nathalia Lietuvaite</div>
                <div className="text-xs text-gray-500 mt-2">
                  Fortgeschrittene Quantenkommunikationsforschung für 
                  autonome Verkehrssysteme der nächsten Generation
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuantumFoundation;
