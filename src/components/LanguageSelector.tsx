import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  isMobile?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobile = false }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const languages: Language[] = [
    { code: 'en', name: t('languages.english'), flag: '🇺🇸' },
    { code: 'es', name: t('languages.spanish'), flag: '🇪🇸' },
    { code: 'fr', name: t('languages.french'), flag: '🇫🇷' },
    { code: 'de', name: t('languages.german'), flag: '🇩🇪' },
    { code: 'it', name: t('languages.italian'), flag: '🇮🇹' },
    { code: 'pt', name: t('languages.portuguese'), flag: '🇵🇹' },
    { code: 'ja', name: t('languages.japanese'), flag: '🇯🇵' },
    { code: 'zh', name: t('languages.chinese'), flag: '🇨🇳' },
    { code: 'ar', name: t('languages.arabic'), flag: '🇸🇦' },
    { code: 'hi', name: t('languages.hindi'), flag: '🇮🇳' },
  ];

  // Fallback to English if i18n is not ready
  const currentLanguage = languages.find(lang => lang.code === (i18n?.language || 'en')) || languages[0];

  // Ensure component is visible after mount (fixes Chrome rendering issues)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const changeLanguage = (languageCode: string) => {
    if (i18n) {
      i18n.changeLanguage(languageCode);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!isVisible) {
    return (
      <div className="relative min-w-[44px] min-h-[44px] bg-gray-100 rounded-lg animate-pulse">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400">🌐</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-200 border border-gray-200 hover:border-gray-300 bg-white shadow-sm min-w-[44px] min-h-[44px] ${
          isMobile ? 'w-full justify-between' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '44px',
          minHeight: '44px',
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? 'visible' : 'hidden'
        }}
      >
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Globe icon - always visible */}
          <span 
            className="text-xl leading-none" 
            aria-hidden="true"
            style={{
              display: 'inline-block',
              fontSize: '20px',
              lineHeight: '1',
              minWidth: '20px',
              textAlign: 'center',
              opacity: 1,
              visibility: 'visible'
            }}
          >
            🌐
          </span>
          
          {/* Flag - always visible */}
          <span 
            className="text-lg leading-none" 
            aria-hidden="true"
            style={{
              display: 'inline-block',
              fontSize: '18px',
              lineHeight: '1',
              minWidth: '18px',
              textAlign: 'center',
              opacity: 1,
              visibility: 'visible'
            }}
          >
            {currentLanguage.flag}
          </span>
          
          {/* Language code - hidden on small screens */}
          <span 
            className="hidden sm:block font-semibold text-sm leading-none"
          >
            {currentLanguage.code.toUpperCase()}
          </span>
        </div>
        
        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            minWidth: '16px',
            minHeight: '16px'
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-2 bg-white rounded-md shadow-lg border border-gray-200 z-50 ${
            isMobile 
              ? 'left-0 right-0 w-full' 
              : 'right-0 w-48 md:right-0 md:left-auto left-0'
          }`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                  (i18n?.language || 'en') === language.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                }`}
                role="menuitem"
                aria-current={(i18n?.language || 'en') === language.code ? 'true' : undefined}
              >
                <span 
                  className="text-lg" 
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    fontSize: '18px',
                    lineHeight: '1',
                    minWidth: '18px',
                    textAlign: 'center'
                  }}
                >
                  {language.flag}
                </span>
                <span className="flex-1">{language.name}</span>
                {(i18n?.language || 'en') === language.code && (
                  <svg
                    className="w-4 h-4 ml-auto text-primary-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
