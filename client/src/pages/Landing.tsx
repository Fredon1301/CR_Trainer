import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Play, Crown, Shield, Trophy, Users, Cog, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function Landing() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const handleStartTraining = () => {
    // Training requires login, so redirect to login page
    setLocation('/login');
  };

  const handleExploreCards = () => {
    // Cards page is available without login
    setLocation('/cards');
  };

  const features = [
    {
      icon: Shield,
      titleKey: 'features.clanWars',
      description: 'Acompanhe histórico de guerras, estatísticas atuais e logs detalhados do seu clã.',
      color: 'purple'
    },
    {
      icon: Users,
      titleKey: 'features.playerStats',
      description: 'Consulte perfis de jogadores, troféus, decks favoritos e histórico de batalhas.',
      color: 'blue'
    },
    {
      icon: Trophy,
      titleKey: 'features.tournaments',
      description: 'Encontre torneios ativos, rankings globais e informações de competições.',
      color: 'green'
    }
  ];

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-game-dark via-game-card to-game-dark opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight" dangerouslySetInnerHTML={{
                __html: t('landing.heroTitle').replace('Clash Royale', '<span class="text-game-orange">Clash Royale</span>')
              }}>
              </h1>
              <p className="text-xl lg:text-2xl text-game-text max-w-3xl mx-auto">
                {t('landing.heroSubtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Button
                onClick={handleStartTraining}
                className="w-full sm:w-auto px-8 py-4 bg-game-orange text-white rounded-xl font-semibold text-lg hover:bg-game-orange/90 transition-all transform hover:scale-105"
                data-testid="button-start-training"
              >
                <Play className="mr-2" />
                {t('landing.startTraining')}
              </Button>
              <Button
                onClick={handleExploreCards}
                variant="outline"
                className="w-full sm:w-auto px-8 py-4 border-2 border-game-orange text-game-orange rounded-xl font-semibold text-lg hover:bg-game-orange hover:text-white transition-all"
                data-testid="button-explore-cards"
              >
                <Crown className="mr-2" />
                {t('landing.exploreCards')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Training Modes */}
      <section className="py-20 bg-gradient-to-b from-game-dark to-game-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t('training.title')}</h2>
            <p className="text-xl text-game-text">{t('training.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-game-card rounded-2xl p-8 border border-game-muted hover:border-game-orange transition-all group">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-game-orange bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Crown className="text-3xl text-game-orange" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">{t('training.gridMode.title')}</h3>
                  <p className="text-game-text mb-6">{t('training.gridMode.description')}</p>
                </div>
                <Button
                  onClick={handleStartTraining}
                  className="w-full py-4 bg-game-orange text-white rounded-xl font-semibold hover:bg-game-orange/90 transition-colors"
                  data-testid="button-grid-training"
                >
                  {t('training.gridMode.start')}
                </Button>
              </div>
            </div>

            <div className="bg-game-card rounded-2xl p-8 border border-game-muted hover:border-game-orange transition-all group">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-game-yellow bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Play className="text-3xl text-game-yellow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">{t('training.simulationMode.title')}</h3>
                  <p className="text-game-text mb-6">{t('training.simulationMode.description')}</p>
                </div>
                <Button
                  onClick={handleStartTraining}
                  className="w-full py-4 bg-game-yellow text-white rounded-xl font-semibold hover:bg-game-yellow/90 transition-colors"
                  data-testid="button-simulation-training"
                >
                  {t('training.simulationMode.start')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="bg-game-card border-t border-game-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Crown className="text-game-orange text-xl" />
                <h3 className="text-lg font-bold text-white">CR Trainer</h3>
              </div>
              <p className="text-game-text text-sm">
                {t('landing.footerDescription')}
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t('landing.training')}</h4>
              <ul className="space-y-2 text-sm text-game-text">
                <li><a href="#" className="hover:text-game-orange transition-colors">{t('training.gridMode.title')}</a></li>
                <li><a href="#" className="hover:text-game-orange transition-colors">{t('training.simulationMode.title')}</a></li>
                <li><a href="#" className="hover:text-game-orange transition-colors">{t('cards.title')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t('landing.apiFeatures')}</h4>
              <ul className="space-y-2 text-sm text-game-text">
                <li><a href="#" className="hover:text-game-orange transition-colors">{t('features.clanWars')}</a></li>
                <li><a href="#" className="hover:text-game-orange transition-colors">{t('features.playerStats')}</a></li>
                <li><a href="#" className="hover:text-game-orange transition-colors">{t('features.tournaments')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t('landing.support')}</h4>
              <ul className="space-y-2 text-sm text-game-text">
                <li><Link href="/faq" className="hover:text-game-orange transition-colors">{t('landing.faq')}</Link></li>
                <li><Link href="/contact" className="hover:text-game-orange transition-colors">{t('landing.contact')}</Link></li>
                <li><Link href="/documentation" className="hover:text-game-orange transition-colors">{t('landing.documentation')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-game-muted mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-game-text">{t('landing.rightsReserved')}</p>
            <p className="text-sm text-game-text mt-2 md:mt-0">
              {t('common.supercellDisclaimer').split('Supercell’s Fan Content Policy.').map((part, index) => (
                <span key={index}>
                  {part}
                  {index === 0 && (
                    <a
                      href={t('common.supercellPolicyUrl')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-game-orange hover:underline inline-flex items-center"
                    >
                      Supercell’s Fan Content Policy. <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </span>
              ))}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
