import { useI18n, Language } from '@/lib/i18n';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'ENG' },
  { code: 'de', label: 'DEU' },
  { code: 'zh', label: '中文' },
];

const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-1 bg-black/60 backdrop-blur-md border border-cyan-400/30 rounded-full px-1 py-1">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
            lang === l.code
              ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30'
              : 'text-cyan-300/70 hover:text-cyan-200 hover:bg-white/5'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
