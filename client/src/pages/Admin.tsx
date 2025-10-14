import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';
import { isUnauthorizedError } from '@/lib/authUtils';
import Header from '@/components/Header';
import { Plus, Edit, Trash2, Users, Settings } from 'lucide-react';
import type { Card as CardType, InsertCard } from '@shared/schema';

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [cardForm, setCardForm] = useState<InsertCard>({
    name: '',
    nameEn: '',
    elixirCost: 1,
    rarity: 'Common',
    type: 'Troop',
    description: '',
    descriptionEn: '',
    hitpoints: undefined,
    damage: undefined,
    imageUrl: '',
  });

  // Check admin permission
  if (!isAuthenticated || user?.permission !== 10) {
    return (
      <div className="bg-game-dark text-game-text font-game min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">{t('admin.accessDenied')}</h1>
            <p className="text-game-text">{t('admin.permissionRequired')}</p>
          </div>
        </div>
      </div>
    );
  }

  const { data: cards = [], isLoading } = useQuery<CardType[]>({
    queryKey: ['/api/cards'],
  });

  const createCardMutation = useMutation({
    mutationFn: async (card: InsertCard) => {
      await apiRequest('POST', '/api/cards', card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      setIsCardModalOpen(false);
      setCardForm({
        name: '',
        nameEn: '',
        elixirCost: 1,
        rarity: 'Common',
        type: 'Troop',
        description: '',
        descriptionEn: '',
        hitpoints: undefined,
        damage: undefined,
        imageUrl: '',
      });
      toast({
        title: t('common.success'),
        description: t('admin.cardCreated'),
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t('common.unauthorized'),
          description: t('common.relogin'),
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation('/login');
        }, 500);
        return;
      }
      toast({
        title: t('common.error'),
        description: t('admin.errorCreatingCard'),
        variant: 'destructive',
      });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: async ({ id, card }: { id: string; card: Partial<InsertCard> }) => {
      await apiRequest('PUT', `/api/cards/${id}`, card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      setIsCardModalOpen(false);
      setEditingCard(null);
      toast({
        title: t('common.success'),
        description: t('admin.cardUpdated'),
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t('common.unauthorized'),
          description: t('common.relogin'),
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation('/login');
        }, 500);
        return;
      }
      toast({
        title: t('common.error'),
        description: t('admin.errorUpdatingCard'),
        variant: 'destructive',
      });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      await apiRequest('DELETE', `/api/cards/${cardId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      toast({
        title: t('common.success'),
        description: t('admin.cardRemoved'),
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t('common.unauthorized'),
          description: t('common.relogin'),
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation('/login');
        }, 500);
        return;
      }
      toast({
        title: t('common.error'),
        description: t('admin.errorRemovingCard'),
        variant: 'destructive',
      });
    },
  });

  const handleCreateCard = () => {
    createCardMutation.mutate(cardForm);
  };

  const handleUpdateCard = () => {
    if (!editingCard) return;
    updateCardMutation.mutate({ id: editingCard.id, card: cardForm });
  };

  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    setCardForm({
      name: card.name,
      nameEn: card.nameEn,
      elixirCost: card.elixirCost,
      rarity: card.rarity,
      type: card.type,
      description: card.description || '',
      descriptionEn: card.descriptionEn || '',
      hitpoints: card.hitpoints || undefined,
      damage: card.damage || undefined,
      imageUrl: card.imageUrl || '',
    });
    setIsCardModalOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      deleteCardMutation.mutate(cardId);
    }
  };

  const openCreateModal = () => {
    setEditingCard(null);
    setCardForm({
      name: '',
      nameEn: '',
      elixirCost: 1,
      rarity: 'Common',
      type: 'Troop',
      description: '',
      descriptionEn: '',
      hitpoints: undefined,
      damage: undefined,
      imageUrl: '',
    });
    setIsCardModalOpen(true);
  };

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{t('admin.title')}</h1>
          <p className="text-game-text">{t('admin.subtitle')}</p>
        </div>

        {/* Admin Sections */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-game-card border-game-muted">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Plus className="mr-2 text-game-orange" />
                {t('admin.manageCards')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-game-text mb-4">{t('admin.manageCardsDescription')}</p>
              <p className="text-sm text-game-text mb-4">{t('admin.totalCards', { count: cards.length })}</p>
              <Button
                onClick={openCreateModal}
                className="w-full bg-game-orange hover:bg-game-orange/90"
                data-testid="button-add-card"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.addCard')}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-game-card border-game-muted">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="mr-2 text-blue-400" />
                {t('admin.manageUsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-game-text mb-4">{t('admin.manageUsersDescription')}</p>
              <Button variant="outline" className="w-full" disabled>
                {t('admin.comingSoon')}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-game-card border-game-muted">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="mr-2 text-green-400" />
                {t('admin.settings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-game-text mb-4">{t('admin.settingsDescription')}</p>
              <Button variant="outline" className="w-full" disabled>
                {t('admin.comingSoon')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Cards Management */}
        <Card className="bg-game-card border-game-muted">
          <CardHeader>
            <CardTitle className="text-white">{t('admin.manageCards')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-game-text">{t('admin.loadingCards')}</p>
            ) : (
              <div className="grid gap-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-4 bg-game-muted bg-opacity-30 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {card.imageUrl && (
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="w-12 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-white">{card.name}</h4>
                        <p className="text-sm text-game-text">
                          {card.elixirCost} {t('common.elixir')} • {card.rarity} • {card.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditCard(card)}
                        size="sm"
                        variant="outline"
                        data-testid={`button-edit-${card.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteCard(card.id)}
                        size="sm"
                        variant="destructive"
                        data-testid={`button-delete-${card.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <p className="text-center text-game-text py-8">
                    {t('admin.noCardsFoundAdmin')}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card Modal */}
      <Dialog open={isCardModalOpen} onOpenChange={setIsCardModalOpen}>
        <DialogContent className="bg-game-card border-game-muted max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCard ? t('admin.editCard') : t('admin.addNewCard')}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-game-text">{t('common.namePt')}</Label>
              <Input
                id="name"
                value={cardForm.name}
                onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                className="bg-game-muted border-game-muted text-white"
                data-testid="input-card-name"
              />
            </div>

            <div>
              <Label htmlFor="nameEn" className="text-game-text">{t('common.nameEn')}</Label>
              <Input
                id="nameEn"
                value={cardForm.nameEn}
                onChange={(e) => setCardForm({ ...cardForm, nameEn: e.target.value })}
                className="bg-game-muted border-game-muted text-white"
                data-testid="input-card-name-en"
              />
            </div>

            <div>
              <Label htmlFor="elixirCost" className="text-game-text">{t('common.elixirCost')}</Label>
              <Input
                id="elixirCost"
                type="number"
                min="1"
                max="10"
                value={cardForm.elixirCost}
                onChange={(e) => setCardForm({ ...cardForm, elixirCost: parseInt(e.target.value) })}
                className="bg-game-muted border-game-muted text-white"
                data-testid="input-card-elixir"
              />
            </div>

            <div>
              <Label htmlFor="rarity" className="text-game-text">{t('common.rarity')}</Label>
              <Select value={cardForm.rarity} onValueChange={(value) => setCardForm({ ...cardForm, rarity: value })}>
                <SelectTrigger className="bg-game-muted border-game-muted text-white" data-testid="select-card-rarity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Common">Common</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Epic">Epic</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type" className="text-game-text">{t('common.type')}</Label>
              <Select value={cardForm.type} onValueChange={(value) => setCardForm({ ...cardForm, type: value })}>
                <SelectTrigger className="bg-game-muted border-game-muted text-white" data-testid="select-card-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Troop">Troop</SelectItem>
                  <SelectItem value="Spell">Spell</SelectItem>
                  <SelectItem value="Building">Building</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="imageUrl" className="text-game-text">{t('common.imageUrl')}</Label>
              <Input
                id="imageUrl"
                value={cardForm.imageUrl || ''}
                onChange={(e) => setCardForm({ ...cardForm, imageUrl: e.target.value })}
                className="bg-game-muted border-game-muted text-white"
                data-testid="input-card-image-url"
              />
            </div>

            <div>
              <Label htmlFor="hitpoints" className="text-game-text">{t('common.hitpoints')}</Label>
              <Input
                id="hitpoints"
                type="number"
                value={cardForm.hitpoints || ''}
                onChange={(e) => setCardForm({ ...cardForm, hitpoints: e.target.value ? parseInt(e.target.value) : undefined })}
                className="bg-game-muted border-game-muted text-white"
                data-testid="input-card-hitpoints"
              />
            </div>

            <div>
              <Label htmlFor="damage" className="text-game-text">{t('common.damage')}</Label>
              <Input
                id="damage"
                type="number"
                value={cardForm.damage || ''}
                onChange={(e) => setCardForm({ ...cardForm, damage: e.target.value ? parseInt(e.target.value) : undefined })}
                className="bg-game-muted border-game-muted text-white"
                data-testid="input-card-damage"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description" className="text-game-text">{t('common.descriptionPt')}</Label>
              <Textarea
                id="description"
                value={cardForm.description || ''}
                onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                className="bg-game-muted border-game-muted text-white"
                data-testid="textarea-card-description"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="descriptionEn" className="text-game-text">{t('common.descriptionEn')}</Label>
              <Textarea
                id="descriptionEn"
                value={cardForm.descriptionEn || ''}
                onChange={(e) => setCardForm({ ...cardForm, descriptionEn: e.target.value })}
                className="bg-game-muted border-game-muted text-white"
                data-testid="textarea-card-description-en"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              onClick={() => setIsCardModalOpen(false)}
              variant="outline"
              data-testid="button-cancel-card"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={editingCard ? handleUpdateCard : handleCreateCard}
              className="bg-game-orange hover:bg-game-orange/90"
              disabled={createCardMutation.isPending || updateCardMutation.isPending}
              data-testid="button-save-card"
            >
              {editingCard ? t('common.save') : t('common.add')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
