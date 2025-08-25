import { RegisterForm } from "@/components/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">

      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Crie uma nova conta para começar a treinar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Entrar
            </Link>
          </p>
          <div className="mt-4 text-center">
            <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              {t('common.backToHome')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
