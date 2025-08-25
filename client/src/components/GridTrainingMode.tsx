import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/Header';
import { ArrowLeft, Eye, EyeOff, RotateCcw, Target, Droplets } from 'lucide-react';
import type { Card as CardType } from '@shared/schema';

interface GridTrainingModeProps {
  cards: CardType[];
  onExit: () => void;
}

interface CardState {
  card: CardType;
  isRevealed: boolean;
}

export function GridTrainingMode({ cards, onExit }: GridTrainingModeProps) {
  const { t, language } = useLanguage();
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [showElixirCosts, setShowElixirCosts] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize card states
  useEffect(() => {
    if (cards.length > 0) {
      setCardStates(cards.map(card => ({ card, isRevealed: false })));
    }
  }, [cards]);

  const handleCardClick = (cardState: CardState, index: number) => {
    if (gameStarted && !cardState.isRevealed) {
      // In training mode, click reveals the elixir cost
      setCardStates(prev => prev.map((state, i) => 
        i === index ? { ...state, isRevealed: true } : state
      ));
    } else {
      // Show card details modal
      setSelectedCard(cardState.card);
    }
  };

  const toggleAllElixirCosts = () => {
    setShowElixirCosts(!showElixirCosts);
    if (!showElixirCosts) {
      // Reveal all
      setCardStates(prev => prev.map(state => ({ ...state, isRevealed: true })));
    } else {
      // Hide all
      setCardStates(prev => prev.map(state => ({ ...state, isRevealed: false })));
    }
  };

  const resetTraining = () => {
    setCardStates(cards.map(card => ({ card, isRevealed: false })));
    setShowElixirCosts(false);
    setGameStarted(false);
  };

  const startTraining = () => {
    setGameStarted(true);
    setShowElixirCosts(false);
    setCardStates(cards.map(card => ({ card, isRevealed: false })));
  };

  if (cards.length === 0) {
    return (
      <div className="bg-game-dark text-game-text font-game min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              onClick={onExit}
              variant="outline"
              className="mb-4"
              data-testid="button-back-to-training"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Modos
            </Button>
          </div>
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-white mb-2">Nenhuma carta disponível</h3>
            <p className="text-game-text">Adicione algumas cartas no painel administrativo para começar o treinamento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <Button
            onClick={onExit}
            variant="outline"
            className="mb-4"
            data-testid="button-back-to-training"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Modos
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-4">{t('training.gridMode.title')}</h1>
          <p className="text-game-text mb-6">{t('training.gridMode.description')}</p>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
            {!gameStarted ? (
              <Button
                onClick={startTraining}
                className="bg-game-orange hover:bg-game-orange/90"
                data-testid="button-start-grid-training"
              >
                <Target className="mr-2 h-4 w-4" />
                Iniciar Treinamento
              </Button>
            ) : (
              <>
                <Button
                  onClick={toggleAllElixirCosts}
                  variant="outline"
                  className="border-game-orange text-game-orange hover:bg-game-orange hover:text-white"
                  data-testid="button-toggle-elixir"
                >
                  {showElixirCosts ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Esconder Custos
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Mostrar Custos
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetTraining}
                  variant="outline"
                  data-testid="button-reset-training"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reiniciar
                </Button>
              </>
            )}
          </div>

          {gameStarted && (
            <div className="bg-game-card border-game-muted rounded-lg p-4 mb-6">
              <p className="text-game-text text-sm">
                <strong>Instruções:</strong> Clique nas cartas para revelar seus custos de elixir. 
                Tente memorizar antes de revelar tudo!
              </p>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {cardStates.map((cardState, index) => (
            <Card
              key={cardState.card.id}
              className="bg-game-card border-game-muted hover:border-game-orange transition-all cursor-pointer group"
              onClick={() => handleCardClick(cardState, index)}
              data-testid={`grid-card-${cardState.card.id}`}
            >
              <CardContent className="p-4">
                {cardState.card.imageUrl && (
                  <img
                    src={cardState.card.imageUrl}
                    alt={language === 'pt-BR' ? cardState.card.name : cardState.card.nameEn}
                    className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                  />
                )}
                <h4 className="text-white font-semibold text-center text-sm mb-3">
                  {language === 'pt-BR' ? cardState.card.name : cardState.card.nameEn}
                </h4>
                
                {/* Elixir Cost Display */}
                <div className="flex items-center justify-center h-8">
                  {cardState.isRevealed || !gameStarted ? (
                    <div className="flex items-center">
                      <span className="text-game-orange font-bold text-lg mr-1">
                        {cardState.card.elixirCost}
                      </span>
                      <Droplets className="text-purple-400 h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex items-center text-game-text">
                      <span className="text-sm">?</span>
                      <Droplets className="text-gray-500 ml-1 h-4 w-4" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        {gameStarted && (
          <div className="mt-8 text-center">
            <div className="bg-game-card border-game-muted rounded-lg p-4 inline-block">
              <p className="text-game-text">
                Cartas reveladas: {cardStates.filter(state => state.isRevealed).length} / {cardStates.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Details Modal */}
      {selectedCard && (
        <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
          <DialogContent className="bg-game-card border-game-muted max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white text-center">
                {language === 'pt-BR' ? selectedCard.name : selectedCard.nameEn}
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              {selectedCard.imageUrl && (
                <img
                  src={selectedCard.imageUrl}
                  alt={language === 'pt-BR' ? selectedCard.name : selectedCard.nameEn}
                  className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                />
              )}
              <div className="flex items-center justify-center mb-4">
                <span className="text-game-orange font-bold text-3xl mr-2">
                  {selectedCard.elixirCost}
                </span>
                <Droplets className="text-purple-400 h-8 w-8" />
              </div>
              {selectedCard.description && (
                <p className="text-game-text text-sm">
                  {language === 'pt-BR' ? selectedCard.description : selectedCard.descriptionEn}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}