import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ShimmerUI from './components/ShimmerUI';
import AccessibilityControls from './components/AccessibilityControls';
import OfflineControls from './components/OfflineControls';
import { offlineManager } from './utils/offlineManager';
import { screenReader } from './utils/accessibility';
import './i18n'; // Import i18n configuration

// Lazy load microfrontends for better performance
const Dashboard = React.lazy(() => import('./microfrontends/Dashboard'));
const Drivers = React.lazy(() => import('./microfrontends/Drivers'));
const News = React.lazy(() => import('./microfrontends/News'));
const Bookmarks = React.lazy(() => import('./microfrontends/Bookmarks'));

// Loading component for microfrontends
const MicrofrontendLoader: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <ShimmerUI type="card" count={6} />
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize offline manager
    const initializeApp = async () => {
      try {
        await offlineManager.initialize();
        screenReader.announcePageTitle('ABC Racing - F1 News and Statistics');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main id="main-content" role="main" className="pt-16">
          <Suspense fallback={<MicrofrontendLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/news" element={<News />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Accessibility and Offline Controls */}
        <AccessibilityControls />
        <OfflineControls />
      </div>
    </Router>
  );
};

export default App;
