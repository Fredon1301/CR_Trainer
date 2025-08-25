import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export function RegisterForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/register', formData);
      window.location.href = '/'; // Redirect to home on successful registration
    } catch (error: any) {
      toast({
        title: "Erro no Registro",
        description: error?.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input name="firstName" type="text" placeholder="Seu nome" onChange={handleChange} required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input name="lastName" type="text" placeholder="Seu sobrenome" onChange={handleChange} required disabled={isLoading} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" placeholder="seu@email.com" onChange={handleChange} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input name="password" type="password" placeholder="Crie uma senha" onChange={handleChange} required disabled={isLoading} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Criando conta...' : 'Criar Conta'}
      </Button>
    </form>
  );
}
