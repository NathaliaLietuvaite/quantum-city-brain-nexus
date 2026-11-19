import { Eye, EyeOff } from 'lucide-react';
import { useI18n, Language } from '@/lib/i18n';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'ENG' },
  { code: 'de', label: 'DEU' },
  { code: 'zh', label: '中文' },
];

interface LanguageSwitcherProps {
  truthLensEnabled?: boolean;
  onToggleTruthLens?: () => void;
}

const LanguageSwitcher = ({ truthLensEnabled = false, onToggleTruthLens }: LanguageSwitcherProps) => {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="fixed top-3 right-3 z-50 flex flex-wrap items-center justify-end gap-2">
      {onToggleTruthLens && (
        <button
          type="button"
          onClick={onToggleTruthLens}
          aria-pressed={truthLensEnabled}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold backdrop-blur-md transition-all duration-300 ${
            truthLensEnabled
              ? 'border-emerald-300/70 bg-emerald-500/25 text-emerald-100 shadow-lg shadow-emerald-500/25'
              : 'border-cyan-400/30 bg-black/60 text-cyan-200/85 hover:text-white hover:border-cyan-300/60'
          }`}
        >
          {truthLensEnabled ? (
            <Eye className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-cyan-300/70" />
          )}
          <span>{t('mc.lens.toggle')}</span>
          <span className="font-mono text-[10px] opacity-90">
            {t(truthLensEnabled ? 'mc.lens.on' : 'mc.lens.off')}
          </span>
        </button>
      )}

      <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md border border-cyan-400/30 rounded-full px-1 py-1">
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
              lang === l.code
                ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30'
                : 'text-cyan-300/70 hover:text-cyan-200 hover:bg-white/5'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
