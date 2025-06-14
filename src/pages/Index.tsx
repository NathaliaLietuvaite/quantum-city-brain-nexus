
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Brain, Shield, Zap, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import HeroSection from '@/components/HeroSection';
import ConceptOverview from '@/components/ConceptOverview';
import SystemArchitecture from '@/components/SystemArchitecture';
import TransitionStrategy from '@/components/TransitionStrategy';
import FreedomMatrix from '@/components/FreedomMatrix';
import EconomicAnalysis from '@/components/EconomicAnalysis';
import SpeedComparison from '@/components/SpeedComparison';

const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-8">
          <TabsList className="grid grid-cols-6 w-full bg-black/20 backdrop-blur-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Überblick
            </TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-purple-600">
              Architektur
            </TabsTrigger>
            <TabsTrigger value="transition" className="data-[state=active]:bg-purple-600">
              Übergang
            </TabsTrigger>
            <TabsTrigger value="freedom" className="data-[state=active]:bg-purple-600">
              Freiheitsmatrix
            </TabsTrigger>
            <TabsTrigger value="economics" className="data-[state=active]:bg-purple-600">
              Wirtschaftlichkeit
            </TabsTrigger>
            <TabsTrigger value="speed" className="data-[state=active]:bg-purple-600">
              Geschwindigkeit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <ConceptOverview />
          </TabsContent>

          <TabsContent value="architecture" className="space-y-8">
            <SystemArchitecture />
          </TabsContent>

          <TabsContent value="transition" className="space-y-8">
            <TransitionStrategy />
          </TabsContent>

          <TabsContent value="freedom" className="space-y-8">
            <FreedomMatrix />
          </TabsContent>

          <TabsContent value="economics" className="space-y-8">
            <EconomicAnalysis />
          </TabsContent>

          <TabsContent value="speed" className="space-y-8">
            <SpeedComparison />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
