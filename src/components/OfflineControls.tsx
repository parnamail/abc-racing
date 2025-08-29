import React, { useState, useEffect } from 'react';
import { 
  useOfflineStatus,
  useOfflineContent,
  useStorageUsage,
  useOfflinePreferences,
  useContentCaching,
  useSyncOperations,
  useDatabaseOperations,
  formatFileSize
} from '../utils/offlineHooks';

interface OfflineControlsProps {
  className?: string;
}

const OfflineControls: React.FC<OfflineControlsProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Use custom hooks for better organization and performance
  const { isOnline, networkStatus } = useOfflineStatus();
  const { offlineContent, refreshContent } = useOfflineContent();
  const { 
    storageUsage, 
    usagePercentage, 
    isStorageFull, 
    availableSpace,
    refreshStorageUsage 
  } = useStorageUsage();
  const { 
    preferences, 
    updatePreference, 
    updateContentTypePreference 
  } = useOfflinePreferences();
  const { 
    isCaching, 
    cachingType, 
    cacheContent, 
    removeCachedContent, 
    clearAllContent 
  } = useContentCaching();
  const { 
    lastSyncTime, 
    syncData, 
    isSyncing, 
    isSyncSuccess, 
    isSyncError 
  } = useSyncOperations();
  const { isResetting, resetDatabase } = useDatabaseOperations();

  // Refresh data when panel opens
  useEffect(() => {
    if (isOpen) {
      refreshContent();
      refreshStorageUsage();
    }
  }, [isOpen, refreshContent, refreshStorageUsage]);

  // Handle operations with automatic refresh
  const handleOperation = async (operation: () => Promise<boolean>) => {
    const success = await operation();
    if (success) {
      refreshContent();
      refreshStorageUsage();
    }
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
                {networkStatus === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
            {lastSyncTime && (
              <p className="text-xs text-gray-500 mt-1">
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </p>
            )}
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
                className={`h-2 rounded-full transition-all duration-300 ${
                  isStorageFull ? 'bg-red-600' : 'bg-blue-600'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{usagePercentage}% used</span>
              <span>{formatFileSize(availableSpace)} available</span>
            </div>
            {isStorageFull && (
              <p className="text-xs text-red-600 mt-1">
                Storage almost full! Consider clearing some content.
              </p>
            )}
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
                    onClick={() => handleOperation(() => removeCachedContent(content.type))}
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
                  onClick={() => handleOperation(() => cacheContent(type))}
                  disabled={isCaching}
                  className={`px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                    isCaching && cachingType === type
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isCaching && cachingType === type ? 'Caching...' : `Cache ${type}`}
                </button>
              ))}
            </div>
          </div>

          {/* Sync Controls */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sync Data</span>
              <button
                onClick={syncData}
                disabled={!isOnline || isSyncing}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
            {isSyncSuccess && (
              <p className="text-xs text-green-600">Data synced successfully</p>
            )}
            {isSyncError && (
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
                  onChange={(e) => updatePreference('enableOfflineMode', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Offline Mode</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.autoSync}
                  onChange={(e) => updatePreference('autoSync', e.target.checked)}
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
                  onChange={(e) => updatePreference('syncInterval', Number(e.target.value))}
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
                  onChange={(e) => updatePreference('maxStorageSize', Number(e.target.value))}
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
                    onChange={(e) => updateContentTypePreference(type, e.target.checked)}
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
              onClick={() => handleOperation(clearAllContent)}
              className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Clear All Offline Content
            </button>
            <button
              onClick={() => handleOperation(resetDatabase)}
              disabled={isResetting}
              className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? 'Resetting...' : 'Reset Database (Troubleshoot)'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineControls;
