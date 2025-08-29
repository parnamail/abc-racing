import React, { useState, useEffect } from 'react';
import {
  highContrastMode,
  reducedMotion,
  focusManager,
  screenReader,
  AccessibilityTester
} from '../utils/accessibility';

interface AccessibilityControlsProps {
  className?: string;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);

  // Initialize accessibility features
  useEffect(() => {
    // Check user preferences
    if (reducedMotion.respectsUserPreference()) {
      reducedMotion.enable();
    }

    // Announce page load
    screenReader.announcePageTitle('ABC Racing - Accessibility Controls');
  }, []);

  // Handle font size changes
  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    document.documentElement.style.fontSize = `${size}%`;
    focusManager.announce(`Font size changed to ${size}%`);
  };

  // Handle line height changes
  const handleLineHeightChange = (height: number) => {
    setLineHeight(height);
    document.documentElement.style.setProperty('--line-height', height.toString());
    focusManager.announce(`Line height changed to ${height}`);
  };

  // Handle letter spacing changes
  const handleLetterSpacingChange = (spacing: number) => {
    setLetterSpacing(spacing);
    document.documentElement.style.setProperty('--letter-spacing', `${spacing}px`);
    focusManager.announce(`Letter spacing changed to ${spacing}px`);
  };

  // Run comprehensive AAA accessibility tests
  const runAccessibilityTests = () => {
    const complianceResults = AccessibilityTester.runAAAComplianceCheck();
    
    // Format results for display
    const formattedResults: string[] = [];
    
    complianceResults.results.forEach(category => {
      if (!category.passed) {
        formattedResults.push(`\n${category.category}:`);
        category.issues.forEach(issue => {
          formattedResults.push(`  • ${issue}`);
        });
      }
    });
    
    setTestResults(formattedResults);
    
    if (complianceResults.passed) {
      focusManager.announce('All AAA accessibility tests passed!');
    } else {
      focusManager.announce(`Found ${complianceResults.failedChecks} accessibility issues across ${complianceResults.totalChecks} categories`);
    }
    
    // Log detailed results for developers
    console.log('AAA Accessibility Compliance Report:', complianceResults);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      focusManager.announce('Accessibility controls closed');
    }
  };

  return (
    <>
      {/* Accessibility toggle button */}
      <button
        className={`fixed bottom-4 right-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility controls"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        onKeyDown={handleKeyDown}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="sr-only">Accessibility controls</span>
      </button>

      {/* Accessibility panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-6"
          role="dialog"
          aria-labelledby="accessibility-title"
          aria-describedby="accessibility-description"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 id="accessibility-title" className="text-lg font-semibold text-gray-900">
              Accessibility Controls
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Close accessibility controls"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p id="accessibility-description" className="text-sm text-gray-600 mb-4">
            Customize your viewing experience with these accessibility options.
          </p>

          <div className="space-y-4">
            {/* High Contrast Mode */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={highContrastMode.isActive()}
                  onChange={() => highContrastMode.toggle()}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">High Contrast Mode</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Increases color contrast for better visibility</p>
            </div>

            {/* Reduced Motion */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reducedMotion.isActive()}
                  onChange={() => reducedMotion.toggle()}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Reduced Motion</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Reduces animations and transitions</p>
            </div>

            {/* Font Size */}
            <div>
              <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-2">
                Font Size: {fontSize}%
              </label>
              <input
                id="font-size"
                type="range"
                min="75"
                max="200"
                step="25"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>75%</span>
                <span>100%</span>
                <span>125%</span>
                <span>150%</span>
                <span>175%</span>
                <span>200%</span>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label htmlFor="line-height" className="block text-sm font-medium text-gray-700 mb-2">
                Line Height: {lineHeight}
              </label>
              <input
                id="line-height"
                type="range"
                min="1.2"
                max="2.4"
                step="0.2"
                value={lineHeight}
                onChange={(e) => handleLineHeightChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1.2</span>
                <span>1.6</span>
                <span>2.0</span>
                <span>2.4</span>
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <label htmlFor="letter-spacing" className="block text-sm font-medium text-gray-700 mb-2">
                Letter Spacing: {letterSpacing}px
              </label>
              <input
                id="letter-spacing"
                type="range"
                min="0"
                max="2"
                step="0.5"
                value={letterSpacing}
                onChange={(e) => handleLetterSpacingChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0px</span>
                <span>0.5px</span>
                <span>1px</span>
                <span>1.5px</span>
                <span>2px</span>
              </div>
            </div>

            {/* AAA Level Accessibility Test Button */}
            <div>
              <button
                onClick={runAccessibilityTests}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                aria-describedby="test-description"
              >
                🎯 Run AAA Accessibility Tests
              </button>
              <p id="test-description" className="text-xs text-gray-500 mt-1">
                Comprehensive WCAG 2.1 AAA level compliance testing
              </p>
            </div>

            {/* Additional AAA Features */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Additional AAA Features</h3>
              
              {/* Large Text Mode */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={() => {
                      document.body.classList.toggle('large-text');
                      focusManager.announce('Large text mode toggled');
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Large Text Mode</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Increases text size for better readability</p>
              </div>

              {/* Dyslexia-Friendly Font */}
              <div className="mt-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={() => {
                      document.body.classList.toggle('dyslexia-friendly');
                      focusManager.announce('Dyslexia-friendly font toggled');
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Dyslexia-Friendly Font</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Uses OpenDyslexic font for better readability</p>
              </div>

              {/* Color Blind Support */}
              <div className="mt-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={() => {
                      document.body.classList.toggle('colorblind-support');
                      focusManager.announce('Color blind support toggled');
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Color Blind Support</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Adds patterns and labels to color-coded elements</p>
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Accessibility Issues Found:</h3>
                <ul className="text-xs text-yellow-700 space-y-1">
                  {testResults.map((result, index) => (
                    <li key={index}>• {result}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keyboard Shortcuts */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Keyboard Shortcuts:</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Tab</kbd> - Navigate</li>
                <li>• <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Enter</kbd> / <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Space</kbd> - Activate</li>
                <li>• <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">Escape</kbd> - Close panel</li>
                <li>• <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">H</kbd> - Toggle high contrast</li>
                <li>• <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs">R</kbd> - Toggle reduced motion</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Skip links */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
      <a href="#footer" className="skip-link">
        Skip to footer
      </a>
    </>
  );
};

export default AccessibilityControls;
