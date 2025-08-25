import { LoginForm } from "@/components/LoginForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">

      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Acesse sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            Não tem uma conta?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:underline">
              Registre-se
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
