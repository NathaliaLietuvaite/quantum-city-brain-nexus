import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeroSection from '@/components/HeroSection';
import ConceptOverview from '@/components/ConceptOverview';
import SystemArchitecture from '@/components/SystemArchitecture';
import FreedomMatrix from '@/components/FreedomMatrix';
import EconomicAnalysis from '@/components/EconomicAnalysis';
import QuantumFoundation from '@/components/QuantumFoundation';
import GhostSection from '@/components/GhostSection';
import ComparisonSection from '@/components/ComparisonSection';
import VeraRubinSection from '@/components/VeraRubinSection';
import N3USection from '@/components/N3USection';
import WillSection from '@/components/WillSection';
import AirspaceSection from '@/components/AirspaceSection';
import StormSection from '@/components/StormSection';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MarkdownExport from '@/components/MarkdownExport';
import { useI18n } from '@/lib/i18n';

const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <LanguageSwitcher />
      <MarkdownExport />
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 w-full bg-black/30 backdrop-blur-md border border-cyan-400/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.overview')}
            </TabsTrigger>
            <TabsTrigger value="quantum" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.quantum')}
            </TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.architecture')}
            </TabsTrigger>
            <TabsTrigger value="ghost" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.ghost')}
            </TabsTrigger>
            <TabsTrigger value="freedom" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.freedom')}
            </TabsTrigger>
            <TabsTrigger value="economics" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.economics')}
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.comparison')}
            </TabsTrigger>
            <TabsTrigger value="verarubin" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.verarubin')}
            </TabsTrigger>
            <TabsTrigger value="n3u" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.n3u')}
            </TabsTrigger>
            <TabsTrigger value="will" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.will')}
            </TabsTrigger>
            <TabsTrigger value="airspace" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.air')}
            </TabsTrigger>
            <TabsTrigger value="storm" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs md:text-sm">
              {t('nav.storm')}
            </TabsTrigger>


          </TabsList>

          <TabsContent value="overview"><ConceptOverview /></TabsContent>
          <TabsContent value="quantum"><QuantumFoundation /></TabsContent>
          <TabsContent value="architecture"><SystemArchitecture /></TabsContent>
          <TabsContent value="ghost"><GhostSection /></TabsContent>
          <TabsContent value="freedom"><FreedomMatrix /></TabsContent>
          <TabsContent value="economics"><EconomicAnalysis /></TabsContent>
          <TabsContent value="comparison"><ComparisonSection /></TabsContent>
          <TabsContent value="verarubin"><VeraRubinSection /></TabsContent>
          <TabsContent value="n3u"><N3USection /></TabsContent>
          <TabsContent value="will"><WillSection /></TabsContent>
          <TabsContent value="airspace"><AirspaceSection /></TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default Index;
