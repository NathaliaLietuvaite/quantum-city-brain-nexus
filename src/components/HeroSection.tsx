import { motion } from 'framer-motion';
import { Car, Brain, Zap, ExternalLink, Ghost, Cpu, Activity, Compass } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const DETERMINISTIC_PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${((i * 37 + 11) % 96) + 2}%`,
  top: `${((i * 53 + 7) % 92) + 4}%`,
  duration: 4.2 + (i % 5) * 0.65,
  delay: (i % 6) * 0.45,
}));

interface HeroSectionProps {
  onLaunchMissionControl?: () => void;
  onInspectVcd?: () => void;
  onOpenOverview?: () => void;
}

const HeroSection = ({ onLaunchMissionControl, onInspectVcd, onOpenOverview }: HeroSectionProps) => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover opacity-20"
          src="/PQMS_V12M.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-slate-900/90" />
      </div>

      <div className="absolute inset-0">
        {DETERMINISTIC_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-40"
            animate={{ x: [0, 80, 0], y: [0, -80, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            style={{ left: p.left, top: p.top }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-cyan-600/20 backdrop-blur-md border border-cyan-400/30 rounded-full px-6 py-3">
              <Ghost className="w-5 h-5 text-cyan-300" />
              <span className="text-cyan-100 text-sm">{t('hero.badge')}</span>
              <a href="https://github.com/NathaliaLietuvaite/Quantenkommunikation" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-cyan-200 hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span className="text-xs">{t('hero.github')}</span>
              </a>
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            {t('hero.title')}
          </h1>

          <p className="text-lg md:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 bg-cyan-600/20 backdrop-blur-md border border-cyan-400/30 rounded-lg px-6 py-3">
              <Car className="w-6 h-6 text-cyan-300" />
              <span className="text-cyan-100">{t('hero.tag1')}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 bg-blue-600/20 backdrop-blur-md border border-blue-400/30 rounded-lg px-6 py-3">
              <Brain className="w-6 h-6 text-blue-300" />
              <span className="text-blue-100">{t('hero.tag2')}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 bg-purple-600/20 backdrop-blur-md border border-purple-400/30 rounded-lg px-6 py-3">
              <Zap className="w-6 h-6 text-purple-300" />
              <span className="text-purple-100">{t('hero.tag3')}</span>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-cyan-400">{t('hero.stat1.value')}</div>
                <div className="text-gray-300">{t('hero.stat1.label')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">{t('hero.stat2.value')}</div>
                <div className="text-gray-300">{t('hero.stat2.label')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-400">{t('hero.stat3.value')}</div>
                <div className="text-gray-300">{t('hero.stat3.label')}</div>
              </div>
            </div>

            {(onLaunchMissionControl || onInspectVcd || onOpenOverview) && (
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                {onLaunchMissionControl && (
                  <button
                    type="button"
                    onClick={onLaunchMissionControl}
                    className="inline-flex items-center gap-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 text-sm shadow-lg shadow-cyan-500/30 transition"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>{t('mc.hero.launchLab')}</span>
                  </button>
                )}
                {onInspectVcd && (
                  <button
                    type="button"
                    onClick={onInspectVcd}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-100 font-semibold px-5 py-3 text-sm backdrop-blur-md transition"
                  >
                    <Activity className="w-4 h-4 text-emerald-300" />
                    <span>{t('mc.hero.openVcd')}</span>
                  </button>
                )}
                {onOpenOverview && (
                  <button
                    type="button"
                    onClick={onOpenOverview}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-slate-100 font-medium px-5 py-3 text-sm backdrop-blur-md transition"
                  >
                    <Compass className="w-4 h-4 text-cyan-300" />
                    <span>{t('mc.hero.openOverview')}</span>
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
