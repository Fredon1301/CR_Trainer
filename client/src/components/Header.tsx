import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageToggle } from './LanguageToggle';
import { Crown, Menu, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const navigation = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'cards', href: '/cards', label: 'Cards' },
  { key: 'training', href: '/training', label: 'Treino' },
  { key: 'clans', href: '/clans', label: 'Clãs' },
  { key: 'tournaments', href: '/tournaments', label: 'Torneios' },
];

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    setLocation('/login');
    setIsMobileMenuOpen(false);
  };

  const handleRegister = () => {
    setLocation('/register');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/logout');
      // Invalidate user query cache on logout if using react-query for user data
      // queryClient.invalidateQueries('user'); // Uncomment if queryClient is available and needed
      window.location.href = '/'; // Redirect to home page after successful logout
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally, show a toast message for logout error
      // toast({ title: "Logout Error", description: "Failed to logout.", variant: "destructive" });
    }
  };

  return (
    <header className="bg-game-card border-b border-game-muted sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Crown className="text-game-orange text-2xl" />
              <h1 className="text-xl font-bold text-white">CR Trainer</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={!isAuthenticated ? '/login' : item.href}
                className="text-game-text hover:text-game-orange transition-colors"
                data-testid={`nav-${item.key}`}
              >
                {t(`header.${item.key}`)}
              </Link>
            ))}
            {isAuthenticated && user?.permission === 10 && (
              <Link
                href="/admin"
                className="text-game-text hover:text-game-orange transition-colors"
                data-testid="nav-admin"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Language Toggle and Auth */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  {user?.profileImageUrl && (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    data-testid="button-logout"
                  >
                    {t('header.logout')}
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleLogin}
                    size="sm"
                    className="bg-game-orange hover:bg-game-orange/90"
                    data-testid="button-login"
                  >
                    {t('header.login')}
                  </Button>
                  <Button
                    onClick={handleRegister}
                    variant="outline"
                    size="sm"
                    data-testid="button-register"
                  >
                    {t('header.register')}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-game-text hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-game-card border-t border-game-muted">
          <div className="px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={!isAuthenticated ? '/login' : item.href}
                className="block text-game-text hover:text-game-orange transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`mobile-nav-${item.key}`}
              >
                {t(`header.${item.key}`)}
              </Link>
            ))}
            {isAuthenticated && user?.permission === 10 && (
              <Link
                href="/admin"
                className="block text-game-text hover:text-game-orange transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-admin"
              >
                Admin
              </Link>
            )}
            <div className="flex space-x-2 pt-4 border-t border-game-muted">
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1"
                  data-testid="mobile-button-logout"
                >
                  {t('header.logout')}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleLogin}
                    className="flex-1 bg-game-orange hover:bg-game-orange/90"
                    data-testid="mobile-button-login"
                  >
                    {t('header.login')}
                  </Button>
                  <Button
                    onClick={handleRegister}
                    variant="outline"
                    className="flex-1"
                    data-testid="mobile-button-register"
                  >
                    {t('header.register')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
