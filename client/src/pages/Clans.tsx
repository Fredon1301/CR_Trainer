import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

export default function Clans() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="bg-game-dark text-game-text font-game min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">{t('common.loginRequired')}</h1>
            <p className="text-game-text mb-6">{t('clans.loginMessage')}</p>
            <Button
              onClick={() => setLocation('/login')}
              className="bg-game-orange hover:bg-game-orange/90"
              data-testid="button-login-clans"
            >
              {t('common.loginToContinue')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          {t('clans.title')}
        </h1>
        <p className="text-xl text-game-text">
          {t('clans.comingSoon')}
        </p>
      </div>
    </div>
  );
}