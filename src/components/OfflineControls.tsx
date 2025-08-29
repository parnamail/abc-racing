import React, { useState, useEffect } from 'react';
import { 
  offlineManager, 
  OfflineContent, 
  OfflinePreferences 
} from '../utils/offlineManager';
import { focusManager } from '../utils/accessibility';

interface OfflineControlsProps {
  className?: string;
}

const OfflineControls: React.FC<OfflineControlsProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineContent, setOfflineContent] = useState<OfflineContent[]>([]);
  const [preferences, setPreferences] = useState<OfflinePreferences>(offlineManager.getPreferences());
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0 });
  const [isCaching, setIsCaching] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Initialize offline manager and load data
  useEffect(() => {
    const initializeOffline = async () => {
      await offlineManager.initialize();
      loadOfflineData();
      loadStorageUsage();
    };

    initializeOffline();

    // Listen for network status changes
    const handleNetworkChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setIsOnline(customEvent.detail.isOnline);
    };

    window.addEventListener('offlineManager:networkStatusChange', handleNetworkChange as EventListener);

    return () => {
      window.removeEventListener('offlineManager:networkStatusChange', handleNetworkChange as EventListener);
    };
  }, []);

  // Load offline content data
  const loadOfflineData = () => {
    const availableContent = offlineManager.getAvailableOfflineContent();
    setOfflineContent(availableContent);
  };

  // Load storage usage
  const loadStorageUsage = async () => {
    const usage = await offlineManager.getStorageUsage();
    setStorageUsage(usage);
  };

  // Handle caching content
  const handleCacheContent = async (type: string) => {
    setIsCaching(true);
    try {
      // Simulate fetching data (in real app, this would be API calls)
      const mockData = getMockDataForType(type);
      const success = await offlineManager.cacheContent(type, mockData);
      
      if (success) {
        focusManager.announce(`${type} content cached successfully`);
        loadOfflineData();
        loadStorageUsage();
      } else {
        focusManager.announce(`Failed to cache ${type} content`);
      }
    } catch (error) {
      console.error(`Failed to cache ${type}:`, error);
      focusManager.announce(`Error caching ${type} content`);
    } finally {
      setIsCaching(false);
    }
  };

  // Handle removing cached content
  const handleRemoveContent = async (type: string) => {
    try {
      const success = await offlineManager.removeCachedContent(type);
      if (success) {
        focusManager.announce(`${type} content removed`);
        loadOfflineData();
        loadStorageUsage();
      } else {
        focusManager.announce(`Failed to remove ${type} content`);
      }
    } catch (error) {
      console.error(`Failed to remove ${type}:`, error);
      focusManager.announce(`Error removing ${type} content`);
    }
  };

  // Handle clearing all content
  const handleClearAllContent = async () => {
    if (window.confirm('Are you sure you want to clear all offline content?')) {
      try {
        const success = await offlineManager.clearAllCachedContent();
        if (success) {
          focusManager.announce('All offline content cleared');
          loadOfflineData();
          loadStorageUsage();
        } else {
          focusManager.announce('Failed to clear offline content');
        }
      } catch (error) {
        console.error('Failed to clear content:', error);
        focusManager.announce('Error clearing offline content');
      }
    }
  };

  // Handle resetting IndexedDB
  const handleResetDatabase = async () => {
    if (window.confirm('Are you sure you want to reset the offline database? This will delete all cached data and recreate the database structure.')) {
      try {
        await offlineManager.resetIndexedDB();
        focusManager.announce('Database reset successfully');
        loadOfflineData();
        loadStorageUsage();
      } catch (error) {
        console.error('Failed to reset database:', error);
        focusManager.announce('Error resetting database');
      }
    }
  };

  // Handle syncing data
  const handleSyncData = async () => {
    setSyncStatus('syncing');
    try {
      await offlineManager.syncOfflineData();
      setSyncStatus('success');
      focusManager.announce('Data synced successfully');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      focusManager.announce('Failed to sync data');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // Handle preference changes
  const handlePreferenceChange = (key: keyof OfflinePreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    offlineManager.updatePreferences(newPreferences);
    focusManager.announce(`${key} preference updated`);
  };

  // Handle content type preference changes
  const handleContentTypeChange = (type: string, enabled: boolean) => {
    const newPreferences = {
      ...preferences,
      contentTypes: {
        ...preferences.contentTypes,
        [type]: enabled
      }
    };
    setPreferences(newPreferences);
    offlineManager.updatePreferences(newPreferences);
    focusManager.announce(`${type} offline content ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Get mock data for different content types
  const getMockDataForType = (type: string) => {
    const mockData = {
      drivers: {
        drivers: [
          { id: 1, name: 'Max Verstappen', team: 'Red Bull Racing', points: 85 },
          { id: 2, name: 'Charles Leclerc', team: 'Ferrari', points: 72 }
        ]
      },
      news: {
        articles: [
          { id: 1, title: 'Latest F1 News', content: 'Formula 1 updates...' },
          { id: 2, title: 'Race Results', content: 'Recent race outcomes...' }
        ]
      },
      dashboard: {
        stats: {
          totalRaces: 24,
          totalDrivers: 20,
          currentSeason: 2024
        }
      },
      bookmarks: {
        bookmarks: {
          drivers: [],
          news: [],
          races: [],
          teams: []
        }
      }
    };

    return mockData[type as keyof typeof mockData] || {};
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format storage usage percentage
  const getStorageUsagePercentage = (): number => {
    if (storageUsage.total === 0) return 0;
    return Math.round((storageUsage.used / storageUsage.total) * 100);
  };

  return (
    <>
      {/* Offline toggle button */}
      <button
        className={`fixed bottom-4 left-4 z-50 p-3 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Offline controls"
        aria-expanded={isOpen}
        aria-controls="offline-panel"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="sr-only">Offline controls</span>
        
        {/* Online/Offline indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
      </button>

      {/* Offline panel */}
      {isOpen && (
        <div
          id="offline-panel"
          className="fixed bottom-20 left-4 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-h-96 overflow-y-auto"
          role="dialog"
          aria-labelledby="offline-title"
          aria-describedby="offline-description"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 id="offline-title" className="text-lg font-semibold text-gray-900">
              Offline Controls
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Close offline controls"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p id="offline-description" className="text-sm text-gray-600 mb-4">
            Manage offline content and sync settings.
          </p>

          {/* Network Status */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Network Status</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Storage Usage</span>
              <span className="text-xs text-gray-500">
                {formatFileSize(storageUsage.used)} / {formatFileSize(storageUsage.total)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStorageUsagePercentage()}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getStorageUsagePercentage()}% used
            </p>
          </div>

          {/* Offline Content */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Offline Content</h3>
            <div className="space-y-2">
              {offlineContent.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(content.size)} • {content.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveContent(content.type)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    aria-label={`Remove ${content.title} from offline storage`}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {offlineContent.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">No offline content available</p>
              )}
            </div>
          </div>

          {/* Cache Content */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Cache Content</h3>
            <div className="grid grid-cols-2 gap-2">
              {['drivers', 'news', 'dashboard', 'bookmarks'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleCacheContent(type)}
                  disabled={isCaching}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCaching ? 'Caching...' : `Cache ${type}`}
                </button>
              ))}
            </div>
          </div>

          {/* Sync Controls */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sync Data</span>
              <button
                onClick={handleSyncData}
                disabled={!isOnline || syncStatus === 'syncing'}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
            {syncStatus === 'success' && (
              <p className="text-xs text-green-600">Data synced successfully</p>
            )}
            {syncStatus === 'error' && (
              <p className="text-xs text-red-600">Sync failed</p>
            )}
          </div>

          {/* Preferences */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preferences</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.enableOfflineMode}
                  onChange={(e) => handlePreferenceChange('enableOfflineMode', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Offline Mode</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.autoSync}
                  onChange={(e) => handlePreferenceChange('autoSync', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto Sync</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sync Interval (minutes)
                </label>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={preferences.syncInterval}
                  onChange={(e) => handlePreferenceChange('syncInterval', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5m</span>
                  <span>{preferences.syncInterval}m</span>
                  <span>120m</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Storage Size (MB)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={preferences.maxStorageSize}
                  onChange={(e) => handlePreferenceChange('maxStorageSize', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10MB</span>
                  <span>{preferences.maxStorageSize}MB</span>
                  <span>100MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Type Preferences */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Content Types</h3>
            <div className="space-y-2">
              {Object.entries(preferences.contentTypes).map(([type, enabled]) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleContentTypeChange(type, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear All Button */}
          <div className="border-t pt-4 space-y-2">
            <button
              onClick={handleClearAllContent}
              className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Clear All Offline Content
            </button>
            <button
              onClick={handleResetDatabase}
              className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Reset Database (Troubleshoot)
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineControls;
