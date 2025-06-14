
import { motion } from 'framer-motion';
import { Car, Brain, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          {/* Reference to parent project */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-purple-600/20 backdrop-blur-md border border-purple-400/30 rounded-full px-6 py-3">
              <Brain className="w-5 h-5 text-purple-300" />
              <span className="text-purple-200 text-sm">Teil des Quantenkommunikations-Projekts</span>
              <a 
                href="https://github.com/NathaliaLietuvaite/Quantenkommunikation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-purple-300 hover:text-purple-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-xs">GitHub</span>
              </a>
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Quantum City-Brain
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Die Revolution des Verkehrs durch entkörperte Fahrzeuge und 
            dreistufige Quantenintelligenz mit vollständiger Freiheitsmatrix
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-blue-600/20 backdrop-blur-md border border-blue-400/30 rounded-lg px-6 py-3"
            >
              <Car className="w-6 h-6 text-blue-300" />
              <span className="text-blue-200">Entkörperte Fahrzeuge</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-purple-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg px-6 py-3"
            >
              <Brain className="w-6 h-6 text-purple-300" />
              <span className="text-purple-200">Dreistufiges Brain</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-pink-600/20 backdrop-blur-md border border-pink-400/30 rounded-lg px-6 py-3"
            >
              <Zap className="w-6 h-6 text-pink-300" />
              <span className="text-pink-200">Freiheitsmatrix</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-cyan-400">99.9%</div>
                <div className="text-gray-400">Unfallreduktion</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-400">&lt;1ms</div>
                <div className="text-gray-400">Quanten-Latenz</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-pink-400">±20%</div>
                <div className="text-gray-400">Freiheitsgrad</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
