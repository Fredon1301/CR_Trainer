import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { Crown, Target, BookOpen, Zap } from 'lucide-react';
import { Link } from 'wouter';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            CR Trainer
          </h1>
          <p className="text-xl lg:text-2xl text-game-text mb-8 max-w-3xl mx-auto">
            {t('home.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/training">
              <Button className="bg-game-orange hover:bg-game-orange/90 text-white px-8 py-3 text-lg">
                <Target className="mr-2" />
                {t('landing.startTraining')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-game-card border-game-muted">
            <CardContent className="text-center p-6">
              <Crown className="mx-auto text-game-orange text-4xl mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">{t('homeFeatures.cardMemorization')}</h3>
              <p className="text-game-text">
                {t('homeFeatures.cardMemorizationDescription')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-game-card border-game-muted">
            <CardContent className="text-center p-6">
              <Zap className="mx-auto text-game-yellow text-4xl mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">{t('homeFeatures.reactionTraining')}</h3>
              <p className="text-game-text">
                {t('homeFeatures.reactionTrainingDescription')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-game-card border-game-muted">
            <CardContent className="text-center p-6">
              <BookOpen className="mx-auto text-blue-400 text-4xl mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">{t('homeFeatures.advancedStrategy')}</h3>
              <p className="text-game-text">
                {t('homeFeatures.advancedStrategyDescription')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* About */}
        <Card className="bg-game-card border-game-muted">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{t('about.title')}</h2>
            <p className="text-game-text text-center max-w-4xl mx-auto">
              {t('about.description')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
