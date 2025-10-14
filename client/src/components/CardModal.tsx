import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Droplets, Heart, Sword } from 'lucide-react';
interface Card {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  imageUrl?: string;
  elixirCost: number;
  rarity: string;
  hitpoints?: number;
  damage?: number;
}

interface CardModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
}

export function CardModal({ card, isOpen, onClose }: CardModalProps) {
  const { t, language } = useLanguage();

  const cardName = language === 'pt-BR' ? card.name : card.nameEn;
  const cardDescription = language === 'pt-BR' ? card.description : card.descriptionEn;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-game-card border-game-muted max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white">
            {cardName}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6">
          {card.imageUrl && (
            <img
              src={card.imageUrl}
              alt={cardName}
              className="w-48 h-60 object-cover rounded-xl mx-auto shadow-lg"
            />
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-game-orange bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-game-orange font-bold text-xl">{card.elixirCost}</span>
                <Droplets className="inline text-purple-400 ml-2 h-5 w-5" />
              </div>
              <div className="bg-game-muted bg-opacity-50 px-4 py-2 rounded-lg">
                <span className="text-game-text">{card.rarity}</span>
              </div>
            </div>

            {cardDescription && (
              <p className="text-game-text text-sm px-4">{cardDescription}</p>
            )}
          </div>

          {(card.hitpoints || card.damage) && (
            <div className="grid grid-cols-2 gap-4 text-center">
              {card.hitpoints && (
                <div className="bg-game-muted bg-opacity-30 p-3 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Heart className="text-red-400 h-4 w-4 mr-1" />
                    <div className="text-white font-semibold">{card.hitpoints}</div>
                  </div>
                  <div className="text-sm text-game-text">{language === 'pt-BR' ? 'Vida' : 'Hitpoints'}</div>
                </div>
              )}
              {card.damage && (
                <div className="bg-game-muted bg-opacity-30 p-3 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Sword className="text-orange-400 h-4 w-4 mr-1" />
                    <div className="text-white font-semibold">{card.damage}</div>
                  </div>
                  <div className="text-sm text-game-text">{language === 'pt-BR' ? 'Dano' : 'Damage'}</div>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={onClose}
            className="w-full py-3 bg-game-muted text-white rounded-lg hover:bg-game-orange transition-colors"
            data-testid="button-close-modal"
          >
            {t('common.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
