import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import { CardModal } from '@/components/CardModal';
import { Shuffle, Search, Droplets } from 'lucide-react';
import cardsData from '@/data/cards.json';

type CardType = typeof cardsData.items[0];

export default function Cards() {
  const { t, language } = useLanguage();
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [shuffledCards, setShuffledCards] = useState<CardType[]>([]);
  const cards = cardsData.items;

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  const displayCards = shuffledCards.length > 0 ? shuffledCards : cards;

  const filteredCards = displayCards.filter(card => {
    const name = language === 'pt-BR' ? card.name : (card as any).nameEn || card.name;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

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
                placeholder={t('cards.searchPlaceholder')}
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

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-white mb-2">{t('cards.noCardsFound')}</h3>
            <p className="text-game-text">
              {searchTerm ? t('cards.noCardsFoundDescription') : t('cards.noCardsAvailable')}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {filteredCards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                className="bg-game-card border-game-muted hover:border-game-orange transition-all cursor-pointer group"
                onClick={() => handleCardClick(card)}
                data-testid={`card-${card.id}`}
              >
                <CardContent className="p-4">
                  {card.iconUrls.medium && (
                    <img
                      src={card.iconUrls.medium}
                      alt={language === 'pt-BR' ? card.name : (card as any).nameEn || card.name}
                      className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <h4 className="text-white font-semibold text-center text-sm mb-2 h-10 flex items-center justify-center">
                    {language === 'pt-BR' ? card.name : (card as any).nameEn || card.name}
                  </h4>
                  <div className="flex items-center justify-center">
                    <span className="text-game-orange font-bold text-lg">
                      {card.elixirCost}
                    </span>
                    <Droplets className="text-purple-400 ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <CardModal card={selectedCard as any} isOpen={!!selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
