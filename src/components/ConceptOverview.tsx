
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Brain, Shield, Users } from 'lucide-react';

const ConceptOverview = () => {
  const concepts = [
    {
      icon: Car,
      title: "Das entkörperte Fahrzeug",
      description: "Reine Sensor-Aktor-Einheit ohne Onboard-Intelligenz",
      features: [
        "Vollständige Umgebungserfassung via Kameras, Lidar, Radar",
        "Präzise Ausführung externer Steuerbefehle", 
        "Quanten-Transceiver als Kommunikationskern",
        "60% geringere Herstellungskosten"
      ],
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: Brain,
      title: "Dreistufiges Quantum City-Brain",
      description: "Zentrale Intelligenz für optimale Verkehrssteuerung",
      features: [
        "Operatives Gehirn: Echtzeit-Verkehrsoptimierung",
        "Ethik-Governance-Layer: Dilemma-Entscheidungen",
        "Advocatus Diaboli: Juristische Finalinstanz", 
        "Quantenkryptografie für höchste Sicherheit"
      ],
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Lebensrettende Redundanz",
      description: "Car-to-Car-Notlink als Ausfallsicherung",
      features: [
        "Aktivierung bei >50ms Kommunikationslatenz",
        "Autonome Notbremsung mit Warnblinker",
        "Hilfeanforderung an umliegende Fahrzeuge",
        "Überbrückung mit <100€ Hardwarekosten"
      ],
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: Users,
      title: "Gesellschaftlicher Nutzen",
      description: "Revolutionäre Verbesserungen für alle",
      features: [
        "Tödliche Unfälle technisch eliminierbar",
        "40%+ Energieeinsparung durch Platooning",
        "Juristische Klarheit durch Entscheidungskette",
        "440 Mrd. € Einsparungen pro Jahr EU-weit"
      ],
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
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Ein neues Paradigma
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Die Verkehrsrevolution basiert auf vier Grundpfeilern, die zusammen ein sicheres, 
          effizientes und wirtschaftliches Transportsystem schaffen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full hover:bg-black/60 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${concept.color}`}>
                    <concept.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{concept.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {concept.description} 
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {concept.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
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
