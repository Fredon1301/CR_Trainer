import Header from '@/components/Header';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // In a real application, you would send this data to your backend
      // For now, we'll just simulate a success
      console.log('Contact form submitted:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: t('common.success'),
        description: t('contact.successMessage'),
      });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: t('common.error'),
        description: t('contact.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-game-dark text-game-text font-game min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">{t('contact.title')}</h1>
        <p className="text-game-text mb-8">
          {t('contact.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
          <div>
            <Label htmlFor="name">{t('contact.nameLabel')}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="bg-game-muted border-game-muted text-white"
            />
          </div>
          <div>
            <Label htmlFor="email">{t('contact.emailLabel')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="bg-game-muted border-game-muted text-white"
            />
          </div>
          <div>
            <Label htmlFor="subject">{t('contact.subjectLabel')}</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="bg-game-muted border-game-muted text-white"
            />
          </div>
          <div>
            <Label htmlFor="message">{t('contact.messageLabel')}</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isLoading}
              rows={5}
              className="bg-game-muted border-game-muted text-white"
            />
          </div>
          <Button type="submit" className="w-full bg-game-orange hover:bg-game-orange/90" disabled={isLoading}>
            {isLoading ? t('contact.sending') : t('contact.send')}
          </Button>
        </form>
      </div>
    </div>
  );
}