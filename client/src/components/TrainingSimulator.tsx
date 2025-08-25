import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Clock, Target, RotateCcw } from 'lucide-react';
import type { Card } from '@shared/schema';

interface TrainingSimulatorProps {
  cards: Card[];
  settings: {
    timeLimit: number;
    elixirStart: number;
    cardCount: number;
  };
  onExit: () => void;
}

interface GameState {
  currentCards: Card[];
  currentElixir: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeLeft: number;
  gameStarted: boolean;
  gameEnded: boolean;
  showFeedback: boolean;
  feedbackMessage: string;
  isCorrect: boolean;
}

export function TrainingSimulator({ cards, settings, onExit }: TrainingSimulatorProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [gameState, setGameState] = useState<GameState>({
    currentCards: [],
    currentElixir: settings.elixirStart,
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    timeLeft: settings.timeLimit,
    gameStarted: false,
    gameEnded: false,
    showFeedback: false,
    feedbackMessage: '',
    isCorrect: false,
  });

  const [countdownToNext, setCountdownToNext] = useState(0);

  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      await apiRequest('POST', '/api/training-sessions', sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/training-sessions'] });
    },
  });

  const generateRandomCards = useCallback(() => {
    if (cards.length === 0) return [];

    let attempts = 0;
    let selectedCards: Card[];

    do {
      selectedCards = [];
      for (let i = 0; i < settings.cardCount; i++) {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        selectedCards.push(randomCard);
      }
      attempts++;
    } while (
      selectedCards.reduce((sum, card) => sum + card.elixirCost, 0) > settings.elixirStart &&
      attempts < 100
    );

    return selectedCards;
  }, [cards, settings]);

  const startNewRound = useCallback(() => {
    const newCards = generateRandomCards();
    if (newCards.length === 0) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar cartas para esta rodada.",
        variant: "destructive",
      });
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentCards: newCards,
      currentElixir: settings.elixirStart,
      timeLeft: settings.timeLimit,
      showFeedback: false,
      gameStarted: true,
    }));
  }, [generateRandomCards, settings, toast]);

  const handleGuess = (guess: number) => {
    if (gameState.showFeedback || gameState.gameEnded) return;

    const totalCost = gameState.currentCards.reduce((sum, card) => sum + card.elixirCost, 0);
    const correctAnswer = gameState.currentElixir - totalCost;
    const isCorrect = guess === correctAnswer;

    const newScore = isCorrect ? gameState.score + 10 : gameState.score;
    const newCorrectAnswers = isCorrect ? gameState.correctAnswers + 1 : gameState.correctAnswers;

    setGameState(prev => ({
      ...prev,
      score: newScore,
      correctAnswers: newCorrectAnswers,
      totalQuestions: prev.totalQuestions + 1,
      showFeedback: true,
      isCorrect,
      feedbackMessage: isCorrect 
        ? `Correto! +10 pontos`
        : `Incorreto! Era ${correctAnswer} elixir`,
    }));

    if (!isCorrect && newCorrectAnswers < 3) {
      toast({
        title: "Dica",
        description: "Considere praticar mais na modalidade de memorização de elixir para melhorar seus conhecimentos!",
        variant: "default",
      });
    }

    // Start countdown for next round
    setCountdownToNext(15);
  };

  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameEnded: true }));

    // Save session
    saveSessionMutation.mutate({
      mode: 'simulation',
      score: gameState.score,
      correctAnswers: gameState.correctAnswers,
      totalQuestions: gameState.totalQuestions,
      timeSpent: (gameState.totalQuestions * settings.timeLimit),
    });

    if (gameState.correctAnswers > 0) {
      toast({
        title: "Parabéns!",
        description: `Sua mente está afiada! Score: ${gameState.score}`,
        variant: "default",
      });
    }
  }, [gameState, saveSessionMutation, settings.timeLimit, toast]);

  // Timer for current round
  useEffect(() => {
    if (!gameState.gameStarted || gameState.showFeedback || gameState.gameEnded) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up - treat as incorrect answer
          const totalCost = prev.currentCards.reduce((sum, card) => sum + card.elixirCost, 0);
          const correctAnswer = prev.currentElixir - totalCost;
          
          return {
            ...prev,
            timeLeft: 0,
            totalQuestions: prev.totalQuestions + 1,
            showFeedback: true,
            isCorrect: false,
            feedbackMessage: `Tempo esgotado! Era ${correctAnswer} elixir`,
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStarted, gameState.showFeedback, gameState.gameEnded]);

  // Countdown to next round
  useEffect(() => {
    if (countdownToNext <= 0) return;

    const timer = setInterval(() => {
      setCountdownToNext(prev => {
        if (prev <= 1) {
          startNewRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownToNext, startNewRound]);

  if (!gameState.gameStarted) {
    return (
      <div className="fixed inset-0 bg-game-dark z-50 flex flex-col">
        <div className="bg-game-card border-b border-game-muted p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onExit}
                variant="ghost"
                size="sm"
                className="text-game-text hover:text-white"
                data-testid="button-exit-simulator"
              >
                <ArrowLeft className="text-xl" />
              </Button>
              <h2 className="text-xl font-bold text-white">Simulação de Elixir</h2>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-8 max-w-md">
            <h3 className="text-3xl font-bold text-white">Pronto para começar?</h3>
            <p className="text-game-text">
              Cartas aparecerão na tela e você terá {settings.timeLimit} segundos para calcular quanto elixir sobra.
            </p>
            <Button
              onClick={startNewRound}
              className="px-8 py-4 bg-game-orange text-white rounded-xl font-semibold text-lg hover:bg-game-orange/90"
              data-testid="button-start-game"
            >
              <Target className="mr-2" />
              Começar Simulação
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gameEnded) {
    return (
      <div className="fixed inset-0 bg-game-dark z-50 flex flex-col">
        <div className="bg-game-card border-b border-game-muted p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Resultado Final</h2>
            <Button
              onClick={onExit}
              variant="outline"
              data-testid="button-exit-final"
            >
              Sair
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-8 max-w-md">
            <h3 className="text-4xl font-bold text-white">Sessão Finalizada!</h3>
            <div className="space-y-4">
              <div className="bg-game-card p-6 rounded-xl">
                <div className="text-3xl font-bold text-game-orange mb-2">{gameState.score}</div>
                <div className="text-game-text">Pontos Totais</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-game-card p-4 rounded-xl">
                  <div className="text-xl font-bold text-green-400">{gameState.correctAnswers}</div>
                  <div className="text-sm text-game-text">Acertos</div>
                </div>
                <div className="bg-game-card p-4 rounded-xl">
                  <div className="text-xl font-bold text-blue-400">{gameState.totalQuestions}</div>
                  <div className="text-sm text-game-text">Total</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  setGameState({
                    currentCards: [],
                    currentElixir: settings.elixirStart,
                    score: 0,
                    correctAnswers: 0,
                    totalQuestions: 0,
                    timeLeft: settings.timeLimit,
                    gameStarted: false,
                    gameEnded: false,
                    showFeedback: false,
                    feedbackMessage: '',
                    isCorrect: false,
                  });
                  setCountdownToNext(0);
                }}
                className="w-full bg-game-orange hover:bg-game-orange/90"
                data-testid="button-play-again"
              >
                <RotateCcw className="mr-2" />
                Jogar Novamente
              </Button>
              <Button
                onClick={onExit}
                variant="outline"
                className="w-full"
                data-testid="button-exit-game"
              >
                Voltar ao Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-game-dark z-50 flex flex-col">
      {/* Header */}
      <div className="bg-game-card border-b border-game-muted p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              onClick={endGame}
              variant="ghost"
              size="sm"
              className="text-game-text hover:text-white"
              data-testid="button-stop-game"
            >
              <ArrowLeft className="text-xl" />
            </Button>
            <h2 className="text-xl font-bold text-white">Simulação de Elixir</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-game-orange">{gameState.score}</div>
              <div className="text-sm text-game-text">Pontos</div>
            </div>
            <div className="text-center">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-400 mr-1" />
                <div className="text-2xl font-bold text-blue-400">{gameState.timeLeft}</div>
              </div>
              <div className="text-sm text-game-text">Segundos</div>
            </div>
            <Button
              onClick={endGame}
              variant="destructive"
              size="sm"
              data-testid="button-end-game"
            >
              Parar
            </Button>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-8 max-w-md">
          {/* Current Elixir Display */}
          <div className="mb-6">
            <div className="text-lg text-game-text mb-2">Elixir do Adversário:</div>
            <div className="text-4xl font-bold text-purple-400">{gameState.currentElixir}</div>
          </div>

          {/* Current Cards */}
          <div className="space-y-4">
            <div className="text-lg text-game-text">Cartas jogadas:</div>
            <div className="flex justify-center space-x-4">
              {gameState.currentCards.map((card, index) => (
                <div key={index} className="bg-game-card rounded-xl p-4 border border-game-muted">
                  {card.imageUrl && (
                    <img
                      src={card.imageUrl}
                      alt={language === 'pt-BR' ? card.name : card.nameEn}
                      className="w-24 h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="text-white font-semibold text-sm">
                    {language === 'pt-BR' ? card.name : card.nameEn}
                  </div>
                  {gameState.showFeedback && (
                    <div className="text-game-orange font-bold mt-1">{card.elixirCost}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Question or Feedback */}
          {!gameState.showFeedback ? (
            <div className="space-y-4">
              <p className="text-xl text-game-text">Quanto elixir sobra?</p>
              <div className="grid grid-cols-5 gap-3">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <Button
                    key={value}
                    onClick={() => handleGuess(value)}
                    className="w-12 h-12 bg-game-card border-2 border-game-muted rounded-lg text-white font-bold text-lg hover:border-game-orange transition-colors"
                    data-testid={`button-guess-${value}`}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`text-xl font-semibold ${gameState.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {gameState.feedbackMessage}
              </div>
              {countdownToNext > 0 && (
                <div className="text-game-text">
                  Próxima rodada em: <span className="font-bold">{countdownToNext}s</span>
                </div>
              )}
              <Button
                onClick={() => {
                  setCountdownToNext(0);
                  startNewRound();
                }}
                className="bg-game-orange hover:bg-game-orange/90"
                data-testid="button-next-round"
              >
                Próxima Rodada
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
