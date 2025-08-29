import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface NavItem {
  path: string;
  labelKey: string;
  icon: string;
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { path: '/', labelKey: 'navigation.dashboard', icon: '🏠' },
    { path: '/drivers', labelKey: 'navigation.drivers', icon: '🏎️' },
    { path: '/news', labelKey: 'navigation.news', icon: '📰' },
    { path: '/bookmarks', labelKey: 'navigation.bookmarks', icon: '🔖' },
  ];

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav 
      className="bg-white shadow-lg relative"
      role="navigation"
      aria-label={t('navigation.menu')}
      id="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center space-x-2"
                aria-label={t('navigation.home')}
              >
                <span className="text-2xl" aria-hidden="true">🏁</span>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">{t('app.title')}</span>
                <span className="text-lg font-bold text-gray-900 sm:hidden">ABC</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" role="menubar">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                role="menuitem"
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{t(item.labelKey)}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Language Selector and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Language Selector - Always visible */}
            <div className="block">
              <LanguageSelector />
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? t('navigation.close') : t('navigation.menu')}
              >
                <span className="sr-only">{isMobileMenuOpen ? t('navigation.close') : t('navigation.menu')}</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{t(item.labelKey)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
