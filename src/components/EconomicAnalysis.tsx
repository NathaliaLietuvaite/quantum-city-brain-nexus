
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Euro, Calculator, Target } from 'lucide-react';

const EconomicAnalysis = () => {
  const economicData = [
    {
      category: "Jährliche Einsparungen",
      amount: "440 Mrd. €",
      description: "EU-weit ab Vollbetrieb",
      breakdown: [
        { item: "Unfallkosten", value: "230 Mrd. €" },
        { item: "Staukosten", value: "120 Mrd. €" },
        { item: "Umweltfolgekosten", value: "90 Mrd. €" }
      ],
      color: "from-green-600 to-emerald-600"
    },
    {
      category: "Gesamtinvestition",
      amount: "800 Mrd. €",
      description: "EU-weit über 15 Jahre",
      breakdown: [
        { item: "Infrastruktur", value: "450 Mrd. €" },
        { item: "Fahrzeugumrüstung", value: "250 Mrd. €" },
        { item: "System-Integration", value: "100 Mrd. €" }
      ],
      color: "from-blue-600 to-cyan-600"
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
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Wirtschaftlichkeitsanalyse
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Die Freiheitsmatrix-Lösung macht das technische Wagnis zu einem beherrschbaren,
          wirtschaftlich sinnvollen Projekt mit klarem ROI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {economicData.map((data, index) => (
          <motion.div
            key={data.category}
            initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${data.color}`}>
                    <Euro className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{data.category}</CardTitle>
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r bg-clip-text from-white to-gray-300">
                      {data.amount}
                    </div>
                    <p className="text-gray-400 text-sm">{data.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-gray-300">{item.item}</span>
                      <span className="font-semibold text-white">{item.value}</span>
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
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md border-purple-400/30">
          <CardHeader className="text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <CardTitle className="text-purple-200">Return on Freedom</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-purple-300">14,7</div>
            <p className="text-sm text-gray-300 mt-2">
              Jeder in DFZ investierte Euro spart 14,70 € durch höhere Akzeptanz
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md border-green-400/30">
          <CardHeader className="text-center">
            <Calculator className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <CardTitle className="text-green-200">Amortisation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-green-300">1,8 Jahre</div>
            <p className="text-sm text-gray-300 mt-2">
              Vollständige Kostendeckung nach Phase 2
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-md border-blue-400/30">
          <CardHeader className="text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <CardTitle className="text-blue-200">Fahrzeugkosten</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-blue-300">-60%</div>
            <p className="text-sm text-gray-300 mt-2">
              Kosteneinsparung durch entkörperte Fahrzeuge
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-12"
      >
        <Card className="bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-center text-white">Gesellschaftlicher Nutzen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-400">99,9%</div>
                <div className="text-sm text-gray-300">Unfallreduktion</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-400">40%+</div>
                <div className="text-sm text-gray-300">Energieeinsparung</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-400">95%</div>
                <div className="text-sm text-gray-300">Akzeptanzrate</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-gray-300">Rechtssicherheit</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EconomicAnalysis;
