
import { motion } from 'framer-motion';
import { Brain, Car, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-purple-400 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-32 w-6 h-6 bg-blue-400 rounded-full"
          animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Die Revolution des Verkehrs
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            Das entkörperte Fahrzeug und das dreistufige Quantum City-Brain
          </p>

          <div className="flex justify-center space-x-8 mt-12">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center space-y-2"
            >
              <div className="p-4 bg-purple-600/20 rounded-full backdrop-blur-md">
                <Car className="w-8 h-8 text-purple-400" />
              </div>
              <span className="text-sm text-gray-300">Entkörpertes Fahrzeug</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center space-y-2"
            >
              <div className="p-4 bg-blue-600/20 rounded-full backdrop-blur-md">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-sm text-gray-300">Quantum City-Brain</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center space-y-2"
            >
              <div className="p-4 bg-pink-600/20 rounded-full backdrop-blur-md">
                <Zap className="w-8 h-8 text-pink-400" />
              </div>
              <span className="text-sm text-gray-300">Freiheitsmatrix</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-12"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
            >
              Entdecke die Zukunft
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
