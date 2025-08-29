import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/drivers', label: 'Drivers', icon: '🏎️' },
    { path: '/news', label: 'News', icon: '📰' },
    { path: '/bookmarks', label: 'Bookmarks', icon: '🔖' },
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
      aria-label="Main navigation"
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
                aria-label="ABC Racing Homepage"
              >
                <span className="text-2xl" aria-hidden="true">🏁</span>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">ABC Racing</span>
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
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Language Selector */}
            <LanguageSelector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
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
       <div 
         id="mobile-menu"
         className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
         role="menu"
         aria-label="Mobile navigation menu"
       >
         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
           {navItems.map((item) => (
             <Link
               key={item.path}
               to={item.path}
               role="menuitem"
               aria-current={isActive(item.path) ? 'page' : undefined}
               onClick={() => setIsMobileMenuOpen(false)}
               className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                 isActive(item.path)
                   ? 'bg-primary-100 text-primary-700'
                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
               }`}
             >
               <span className="text-lg" aria-hidden="true">{item.icon}</span>
               <span>{item.label}</span>
             </Link>
           ))}
           
           {/* Mobile Language Selector */}
           <div className="px-3 py-2 border-t border-gray-200">
             <div className="text-sm font-medium text-gray-700 mb-2">Language</div>
             <LanguageSelector isMobile={true} />
           </div>
         </div>
       </div>
    </nav>
  );
};

export default Navigation;
