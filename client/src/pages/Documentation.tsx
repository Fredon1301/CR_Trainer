import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';

export default function Documentation() {
  const { t } = useLanguage();

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">{t('documentation.title')}</h1>
        <p className="text-game-text">
          {t('documentation.pageContent')}
        </p>
        {/* Add documentation content here */}
      </div>
    </div>
  );
}