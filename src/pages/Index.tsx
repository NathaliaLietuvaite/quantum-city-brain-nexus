import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
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
import Mod53Section from '@/components/Mod53Section';
import { DmcSection, BrainLinkSection, AlignSection, GStarSection, SovereigntySection, ArgonSection } from '@/components/V12Sections';
import MseSection from '@/components/MseSection';
import NodeAlphaSection from '@/components/NodeAlphaSection';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MarkdownExport from '@/components/MarkdownExport';
import MissionControlNav from '@/components/MissionControlNav';
import { RegisterBadgeBar, TAB_REGISTERS, TRUTH_LENS_STAGE_FRAME } from '@/components/RegisterBadge';
import {
  getPrimaryRegister,
  getSectorForTab,
  MISSION_CONTROL_SECTORS,
  type MissionSectorId,
  type TruthLensFilter,
} from '@/lib/mission-control';
import { useI18n } from '@/lib/i18n';

const Index = () => {
  const [activeSector, setActiveSector] = useState<MissionSectorId>('labs');
  const [activeSection, setActiveSection] = useState<string>('alpha');
  const [showAllTabs, setShowAllTabs] = useState<boolean>(false);
  const [truthLensEnabled, setTruthLensEnabled] = useState<boolean>(false);
  const [truthFilter, setTruthFilter] = useState<TruthLensFilter>('ALL');
  const { t } = useI18n();

  const selectTab = (tabId: string) => {
    setActiveSection(tabId);
    setActiveSector(getSectorForTab(tabId));
  };

  const selectSector = (sector: MissionSectorId) => {
    setShowAllTabs(false);
    setActiveSector(sector);
    if (getSectorForTab(activeSection) !== sector) {
      const target = MISSION_CONTROL_SECTORS.find((s) => s.id === sector)?.defaultTab ?? 'alpha';
      setActiveSection(target);
    }
  };

  const scrollToElement = (elementId: string) => {
    requestAnimationFrame(() => {
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const launchLiveLab = () => {
    selectTab('alpha');
    scrollToElement('mission-control');
  };

  const inspectVcdTrace = () => {
    selectTab('alpha');
    setTimeout(() => scrollToElement('rtl-vcd-viewer'), 80);
  };

  const openConceptOverview = () => {
    selectTab('overview');
    scrollToElement('mission-control');
  };

  const activeRegisters = TAB_REGISTERS[activeSection] ?? (['I'] as const);
  const primaryRegister = getPrimaryRegister(activeRegisters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <LanguageSwitcher
        truthLensEnabled={truthLensEnabled}
        onToggleTruthLens={() => {
          setTruthLensEnabled((prev) => {
            if (prev) setTruthFilter('ALL');
            return !prev;
          });
        }}
      />
      <MarkdownExport />
      <HeroSection
        onLaunchMissionControl={launchLiveLab}
        onInspectVcd={inspectVcdTrace}
        onOpenOverview={openConceptOverview}
      />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeSection} onValueChange={selectTab} className="space-y-6">
          <MissionControlNav
            activeSector={activeSector}
            activeTab={activeSection}
            showAllTabs={showAllTabs}
            truthLensEnabled={truthLensEnabled}
            truthFilter={truthFilter}
            onSelectSector={selectSector}
            onSelectTab={selectTab}
            onToggleShowAll={() => setShowAllTabs((prev) => !prev)}
            onSetTruthFilter={setTruthFilter}
          />

          <div className="space-y-3">
            <RegisterBadgeBar registers={activeRegisters} />
            {truthLensEnabled && (
              <p className="text-center font-mono text-xs text-slate-200 max-w-3xl mx-auto">
                {t(`mc.lens.activeStage.${primaryRegister}`)}
              </p>
            )}
          </div>

          <div className={truthLensEnabled ? TRUTH_LENS_STAGE_FRAME[primaryRegister] : ''}>
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
            <TabsContent value="storm"><StormSection /></TabsContent>
            <TabsContent value="mod53"><Mod53Section /></TabsContent>
            <TabsContent value="dmc"><DmcSection /></TabsContent>
            <TabsContent value="brain"><BrainLinkSection /></TabsContent>
            <TabsContent value="align"><AlignSection /></TabsContent>
            <TabsContent value="gstar"><GStarSection /></TabsContent>
            <TabsContent value="sov"><SovereigntySection /></TabsContent>
            <TabsContent value="mse"><MseSection /></TabsContent>
            <TabsContent value="argon"><ArgonSection /></TabsContent>
            <TabsContent value="alpha"><NodeAlphaSection /></TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
