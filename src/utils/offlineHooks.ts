import { useState, useEffect, useCallback, useMemo } from 'react';
import { offlineManager, OfflineContent, OfflinePreferences } from './offlineManager';
import { focusManager } from './accessibility';

// Hook for managing offline state and network status
export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkStatus('online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkStatus('offline');
    };

    const handleNetworkChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const online = customEvent.detail.isOnline;
      setIsOnline(online);
      setNetworkStatus(online ? 'online' : 'offline');
    };

    // Set initial status
    setNetworkStatus(navigator.onLine ? 'online' : 'offline');

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offlineManager:networkStatusChange', handleNetworkChange as EventListener);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offlineManager:networkStatusChange', handleNetworkChange as EventListener);
    };
  }, []);

  return {
    isOnline,
    networkStatus,
    isOffline: !isOnline
  };
};

// Hook for managing offline content
export const useOfflineContent = () => {
  const [offlineContent, setOfflineContent] = useState<OfflineContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOfflineData = useCallback(() => {
    const availableContent = offlineManager.getAvailableOfflineContent();
    setOfflineContent(availableContent);
  }, []);

  const refreshContent = useCallback(() => {
    loadOfflineData();
  }, [loadOfflineData]);

  useEffect(() => {
    loadOfflineData();
  }, [loadOfflineData]);

  return {
    offlineContent,
    isLoading,
    loadOfflineData,
    refreshContent
  };
};

// Hook for managing storage usage
export const useStorageUsage = () => {
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const loadStorageUsage = useCallback(async () => {
    setIsLoading(true);
    try {
      const usage = await offlineManager.getStorageUsage();
      setStorageUsage(usage);
    } catch (error) {
      console.error('Failed to load storage usage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStorageUsage = useCallback(() => {
    loadStorageUsage();
  }, [loadStorageUsage]);

  useEffect(() => {
    loadStorageUsage();
  }, [loadStorageUsage]);

  // Computed values
  const usagePercentage = useMemo(() => {
    if (storageUsage.total === 0) return 0;
    return Math.round((storageUsage.used / storageUsage.total) * 100);
  }, [storageUsage.used, storageUsage.total]);

  const isStorageFull = useMemo(() => {
    return usagePercentage >= 90;
  }, [usagePercentage]);

  const availableSpace = useMemo(() => {
    return storageUsage.total - storageUsage.used;
  }, [storageUsage.total, storageUsage.used]);

  return {
    storageUsage,
    isLoading,
    usagePercentage,
    isStorageFull,
    availableSpace,
    loadStorageUsage,
    refreshStorageUsage
  };
};

// Hook for managing offline preferences
export const useOfflinePreferences = () => {
  const [preferences, setPreferences] = useState<OfflinePreferences>(offlineManager.getPreferences());
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePreference = useCallback(async (key: keyof OfflinePreferences, value: any) => {
    setIsUpdating(true);
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      await offlineManager.updatePreferences(newPreferences);
      focusManager.announce(`${key} preference updated`);
      return true;
    } catch (error) {
      console.error('Failed to update preference:', error);
      focusManager.announce(`Failed to update ${key} preference`);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [preferences]);

  const updateContentTypePreference = useCallback(async (type: string, enabled: boolean) => {
    setIsUpdating(true);
    try {
      const newPreferences = {
        ...preferences,
        contentTypes: {
          ...preferences.contentTypes,
          [type]: enabled
        }
      };
      setPreferences(newPreferences);
      await offlineManager.updatePreferences(newPreferences);
      focusManager.announce(`${type} offline content ${enabled ? 'enabled' : 'disabled'}`);
      return true;
    } catch (error) {
      console.error('Failed to update content type preference:', error);
      focusManager.announce(`Failed to update ${type} preference`);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [preferences]);

  const resetPreferences = useCallback(async () => {
    setIsUpdating(true);
    try {
      const defaultPreferences = offlineManager.getDefaultPreferences();
      setPreferences(defaultPreferences);
      await offlineManager.updatePreferences(defaultPreferences);
      focusManager.announce('Preferences reset to default');
      return true;
    } catch (error) {
      console.error('Failed to reset preferences:', error);
      focusManager.announce('Failed to reset preferences');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    preferences,
    isUpdating,
    updatePreference,
    updateContentTypePreference,
    resetPreferences
  };
};

// Hook for managing content caching operations
export const useContentCaching = () => {
  const [isCaching, setIsCaching] = useState(false);
  const [cachingType, setCachingType] = useState<string | null>(null);

  const cacheContent = useCallback(async (type: string) => {
    setIsCaching(true);
    setCachingType(type);
    
    try {
      // Simulate fetching data (in real app, this would be API calls)
      const mockData = getMockDataForType(type);
      const success = await offlineManager.cacheContent(type, mockData);
      
      if (success) {
        focusManager.announce(`${type} content cached successfully`);
        return true;
      } else {
        focusManager.announce(`Failed to cache ${type} content`);
        return false;
      }
    } catch (error) {
      console.error(`Failed to cache ${type}:`, error);
      focusManager.announce(`Error caching ${type} content`);
      return false;
    } finally {
      setIsCaching(false);
      setCachingType(null);
    }
  }, []);

  const removeCachedContent = useCallback(async (type: string) => {
    try {
      const success = await offlineManager.removeCachedContent(type);
      if (success) {
        focusManager.announce(`${type} content removed`);
        return true;
      } else {
        focusManager.announce(`Failed to remove ${type} content`);
        return false;
      }
    } catch (error) {
      console.error(`Failed to remove ${type}:`, error);
      focusManager.announce(`Error removing ${type} content`);
      return false;
    }
  }, []);

  const clearAllContent = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear all offline content?')) {
      try {
        const success = await offlineManager.clearAllCachedContent();
        if (success) {
          focusManager.announce('All offline content cleared');
          return true;
        } else {
          focusManager.announce('Failed to clear offline content');
          return false;
        }
      } catch (error) {
        console.error('Failed to clear content:', error);
        focusManager.announce('Error clearing offline content');
        return false;
      }
    }
    return false;
  }, []);

  return {
    isCaching,
    cachingType,
    cacheContent,
    removeCachedContent,
    clearAllContent
  };
};

// Hook for managing sync operations
export const useSyncOperations = () => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncData = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      await offlineManager.syncOfflineData();
      setSyncStatus('success');
      setLastSyncTime(new Date());
      focusManager.announce('Data synced successfully');
      
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
      return true;
    } catch (error) {
      setSyncStatus('error');
      focusManager.announce('Failed to sync data');
      
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
      return false;
    }
  }, []);

  const resetSyncStatus = useCallback(() => {
    setSyncStatus('idle');
  }, []);

  return {
    syncStatus,
    lastSyncTime,
    syncData,
    resetSyncStatus,
    isSyncing: syncStatus === 'syncing',
    isSyncSuccess: syncStatus === 'success',
    isSyncError: syncStatus === 'error'
  };
};

// Hook for managing database operations
export const useDatabaseOperations = () => {
  const [isResetting, setIsResetting] = useState(false);

  const resetDatabase = useCallback(async () => {
    if (window.confirm('Are you sure you want to reset the offline database? This will delete all cached data and recreate the database structure.')) {
      setIsResetting(true);
      try {
        await offlineManager.resetIndexedDB();
        focusManager.announce('Database reset successfully');
        return true;
      } catch (error) {
        console.error('Failed to reset database:', error);
        focusManager.announce('Error resetting database');
        return false;
      } finally {
        setIsResetting(false);
      }
    }
    return false;
  }, []);

  return {
    isResetting,
    resetDatabase
  };
};

// Utility function for mock data
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

// Utility function for formatting file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
