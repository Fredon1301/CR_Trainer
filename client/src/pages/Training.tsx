import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { TrainingSimulator } from '@/components/TrainingSimulator';
import { Crown, Target, Play, Settings } from 'lucide-react';
import type { Card as CardType } from '@shared/schema';
import { GridTrainingMode } from '../components/GridTrainingMode';

export default function Training() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [simulatorSettings, setSimulatorSettings] = useState({
    timeLimit: 5,
    elixirStart: 10,
    cardCount: 2,
  });

  // Get mode from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const mode = params.get('mode');
    if (mode) {
      setActiveMode(mode);
    }
  }, [location]);

  const { data: cards = [] } = useQuery<CardType[]>({
    queryKey: ['/api/cards'],
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-game-dark text-game-text font-game min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Login Required</h1>
            <p className="text-game-text mb-6">You need to be logged in to access training modes.</p>
            <Button
              onClick={() => setLocation('/login')}
              className="bg-game-orange hover:bg-game-orange/90"
            >
              Login to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (activeMode === 'grid') {
    return <GridTrainingMode cards={cards} onExit={() => setActiveMode(null)} />;
  }

  if (activeMode === 'simulation') {
    return (
      <TrainingSimulator
        cards={cards}
        settings={simulatorSettings}
        onExit={() => setActiveMode(null)}
      />
    );
  }

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t('training.title')}</h1>
          <p className="text-xl text-game-text">{t('training.subtitle')}</p>
        </div>

        {/* Training Mode Selection */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <Card className="bg-game-card border-game-muted hover:border-game-orange transition-all group">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-white">
                <Crown className="mr-2 text-game-orange text-2xl" />
                {t('training.gridMode.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-game-text">{t('training.gridMode.description')}</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center text-sm text-game-text">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Grade interativa de cartas
                </div>
                <div className="flex items-center justify-center text-sm text-game-text">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Pop-ups com detalhes das cartas
                </div>
                <div className="flex items-center justify-center text-sm text-game-text">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Teste de conhecimento
                </div>
              </div>

              <Button
                onClick={() => setActiveMode('grid')}
                className="w-full py-4 bg-game-orange text-white rounded-xl font-semibold hover:bg-game-orange/90 transition-colors"
                data-testid="button-start-grid-mode"
              >
                <Play className="mr-2" />
                {t('training.gridMode.start')}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-game-card border-game-muted hover:border-game-orange transition-all group">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-white">
                <Target className="mr-2 text-game-yellow text-2xl" />
                {t('training.simulationMode.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-game-text">{t('training.simulationMode.description')}</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center text-sm text-game-text">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Cartas aleatórias
                </div>
                <div className="flex items-center justify-center text-sm text-game-text">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Cronômetro de reação
                </div>
                <div className="flex items-center justify-center text-sm text-game-text">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Sistema de pontuação
                </div>
              </div>

              <Button
                onClick={() => setActiveMode('simulation')}
                className="w-full py-4 bg-game-yellow text-white rounded-xl font-semibold hover:bg-game-yellow/90 transition-colors"
                data-testid="button-start-simulation-mode"
              >
                <Play className="mr-2" />
                {t('training.simulationMode.start')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Training Tips */}
        <Card className="bg-game-card border-game-muted">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="mr-2 text-game-orange" />
              Como isso vai te ajudar?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-game-text">
              O Clash Royale é um jogo de estratégia que exige raciocínio rápido. Ao memorizar e saber instantaneamente 
              a quantidade de elixir das cartas que seu inimigo jogar, você conseguirá identificar quando ele está em 
              desvantagem de elixir e poderá punir suas jogadas com contra-ataques efetivos. Este treinamento desenvolve 
              sua capacidade de cálculo rápido e tomada de decisões estratégicas em tempo real.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
