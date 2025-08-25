import { useLanguage } from '../hooks/useLanguage';
import Header from '../components/Header';

export default function Tournaments() {
  const { t } = useLanguage();

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          {t('tournaments.title')}
        </h1>
        <p className="text-xl text-game-text">
          {t('tournaments.comingSoon')}
        </p>
      </div>
    </div>
  );
}
