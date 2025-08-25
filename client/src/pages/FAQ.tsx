import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';

export default function FAQ() {
  const { t } = useLanguage();

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">FAQ</h1>
        <p className="text-game-text">
          {t('faq.pageContent')}
        </p>
        {/* Add FAQ content here */}
      </div>
    </div>
  );
}