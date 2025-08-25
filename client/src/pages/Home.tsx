import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { Play, Crown, Target, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Bem-vindo de volta, {user?.firstName || 'Treinador'}!
          </h1>
          <p className="text-xl text-game-text">
            Continue seu treinamento e melhore suas habilidades no Clash Royale.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-game-card border-game-muted hover:border-game-orange transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Crown className="mr-2 text-game-orange" />
                {t('training.gridMode.title')}
              </CardTitle>
              <CardDescription className="text-game-text">
                Pratique memorização com todas as cartas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/training?mode=grid">
                <Button className="w-full bg-game-orange hover:bg-game-orange/90" data-testid="button-grid-mode">
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-game-card border-game-muted hover:border-game-orange transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Target className="mr-2 text-game-yellow" />
                {t('training.simulationMode.title')}
              </CardTitle>
              <CardDescription className="text-game-text">
                Teste sua velocidade de reação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/training?mode=simulation">
                <Button className="w-full bg-game-yellow hover:bg-game-yellow/90" data-testid="button-simulation-mode">
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-game-card border-game-muted hover:border-game-orange transition-all">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="mr-2 text-blue-400" />
                Ver Progresso
              </CardTitle>
              <CardDescription className="text-game-text">
                Acompanhe suas estatísticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-game-muted text-game-text" data-testid="button-progress">
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>

        
      </div>
    </div>
  );
}
