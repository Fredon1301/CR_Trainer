import { useLanguage } from '@/hooks/useLanguage';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 bg-game-muted rounded-lg p-1">
      <button
        className={`px-2 py-1 rounded text-sm transition-colors ${
          language === 'pt-BR'
            ? 'bg-game-orange text-white'
            : 'text-game-text hover:bg-game-card'
        }`}
        onClick={() => setLanguage('pt-BR')}
        data-testid="button-language-pt"
      >
        🇧🇷 PT
      </button>
      <button
        className={`px-2 py-1 rounded text-sm transition-colors ${
          language === 'en-US'
            ? 'bg-game-orange text-white'
            : 'text-game-text hover:bg-game-card'
        }`}
        onClick={() => setLanguage('en-US')}
        data-testid="button-language-en"
      >
        🇺🇸 EN
      </button>
    </div>
  );
}
