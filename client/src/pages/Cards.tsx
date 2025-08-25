import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/Header';
import { CardModal } from '@/components/CardModal';
import { Shuffle, Search, Droplets, Eye } from 'lucide-react';
import type { Card as CardType } from '@shared/schema';

export default function Cards() {
  const { t, language } = useLanguage();
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [shuffledCards, setShuffledCards] = useState<CardType[]>([]);
  const [elixirCard, setElixirCard] = useState<CardType | null>(null);

  const { data: cards = [], isLoading, error } = useQuery<CardType[]>({
    queryKey: ['/api/cards'],
  });

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  const displayCards = shuffledCards.length > 0 ? shuffledCards : cards;

  const filteredCards = displayCards.filter(card => {
    const name = language === 'pt-BR' ? card.name : card.nameEn;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

  const handleShowElixir = (card: CardType, e: React.MouseEvent) => {
    e.stopPropagation();
    setElixirCard(card);
  };

  if (error) {
    return (
      <div className="bg-game-dark text-game-text font-game min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Erro ao carregar cartas</h1>
            <p className="text-game-text">Não foi possível carregar as cartas. Tente novamente mais tarde.</p>
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
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t('cards.title')}</h1>
          <p className="text-xl text-game-text mb-8">{t('cards.subtitle')}</p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-game-text h-4 w-4" />
              <Input
                placeholder="Buscar cartas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-game-card border-game-muted text-white"
                data-testid="input-search-cards"
              />
            </div>
            <Button
              onClick={shuffleCards}
              className="bg-game-orange hover:bg-game-orange/90"
              data-testid="button-shuffle-cards"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              {t('cards.shuffle')}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-game-text">{t('common.loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCards.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-white mb-2">Nenhuma carta encontrada</h3>
            <p className="text-game-text">
              {searchTerm ? 'Tente ajustar sua busca.' : 'Não há cartas disponíveis no momento.'}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && filteredCards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                className="bg-game-card border-game-muted hover:border-game-orange transition-all cursor-pointer group"
                onClick={() => handleCardClick(card)}
                data-testid={`card-${card.id}`}
              >
                <CardContent className="p-4">
                  {card.imageUrl && (
                    <img
                      src={card.imageUrl}
                      alt={language === 'pt-BR' ? card.name : card.nameEn}
                      className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <h4 className="text-white font-semibold text-center text-sm mb-3">
                    {language === 'pt-BR' ? card.name : card.nameEn}
                  </h4>
                  <Button
                    onClick={(e) => handleShowElixir(card, e)}
                    size="sm"
                    className="w-full bg-game-orange hover:bg-game-orange/90 text-white text-xs"
                    data-testid={`button-show-elixir-${card.id}`}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Ver elixir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Elixir Cost Modal */}
      {elixirCard && (
        <Dialog open={!!elixirCard} onOpenChange={() => setElixirCard(null)}>
          <DialogContent className="bg-game-card border-game-muted max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-white text-center">
                {language === 'pt-BR' ? elixirCard.name : elixirCard.nameEn}
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-6">
              {elixirCard.imageUrl && (
                <img
                  src={elixirCard.imageUrl}
                  alt={language === 'pt-BR' ? elixirCard.name : elixirCard.nameEn}
                  className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                />
              )}
              <div className="flex items-center justify-center">
                <span className="text-game-orange font-bold text-3xl mr-2">
                  {elixirCard.elixirCost}
                </span>
                <Droplets className="text-purple-400 h-8 w-8" />
              </div>
              <p className="text-game-text mt-2">Custo de elixir</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
