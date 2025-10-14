import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageToggle } from './LanguageToggle';
import { Crown, Menu, X, Home, BookOpen, Target } from 'lucide-react';

export default function Header() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { key: 'home', href: '/', label: t('header.home'), icon: Home },
    { key: 'cards', href: '/cards', label: t('header.cards'), icon: BookOpen },
    { key: 'training', href: '/training', label: t('header.training'), icon: Target },
  ];

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
                href={item.href}
                className="text-game-text hover:text-game-orange transition-colors"
                data-testid={`nav-${item.key}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language Toggle */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <LanguageToggle />

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
                href={item.href}
                className="block text-game-text hover:text-game-orange transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`mobile-nav-${item.key}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
