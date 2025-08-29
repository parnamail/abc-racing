// Offline viewing utilities for F1 Racing application
export interface OfflineContent {
  id: string;
  type: 'drivers' | 'news' | 'dashboard' | 'bookmarks';
  title: string;
  description: string;
  size: number; // in bytes
  lastUpdated: Date;
  isAvailable: boolean;
}

export interface OfflinePreferences {
  enableOfflineMode: boolean;
  autoSync: boolean;
  syncInterval: number; // in minutes
  maxStorageSize: number; // in MB
  contentTypes: {
    drivers: boolean;
    news: boolean;
    dashboard: boolean;
    bookmarks: boolean;
  };
}

export class OfflineManager {
  private static instance: OfflineManager;
  private serviceWorker: ServiceWorker | null = null;
  private isOnline: boolean = navigator.onLine;
  private offlineContent: Map<string, OfflineContent> = new Map();
  private preferences: OfflinePreferences = {
    enableOfflineMode: true,
    autoSync: true,
    syncInterval: 30,
    maxStorageSize: 50,
    contentTypes: {
      drivers: true,
      news: true,
      dashboard: true,
      bookmarks: true
    }
  };

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  // Initialize offline functionality
  async initialize(): Promise<void> {
    try {
      // Register service worker
      await this.registerServiceWorker();
      
      // Load saved preferences
      this.loadPreferences();
      
      // Set up online/offline event listeners
      this.setupNetworkListeners();
      
      // Try to initialize offline content, reset DB if it fails
      try {
        await this.initializeOfflineContent();
      } catch (dbError) {
        console.warn('Database initialization failed, resetting IndexedDB:', dbError);
        await this.resetIndexedDB();
        await this.initializeOfflineContent();
      }
      
      console.log('Offline manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize offline manager:', error);
    }
  }

  // Register service worker for offline functionality
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        this.serviceWorker = registration.active;
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                this.showUpdateNotification();
              }
            });
          }
        });

        console.log('Service worker registered successfully');
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  }

  // Set up network status listeners
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onNetworkStatusChange(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.onNetworkStatusChange(false);
    });
  }

  // Handle network status changes
  private onNetworkStatusChange(isOnline: boolean): void {
    if (isOnline) {
      // Sync data when coming back online
      this.syncOfflineData();
    }
    
    // Notify components about network status
    this.dispatchEvent('networkStatusChange', { isOnline });
  }

  // Initialize offline content structure
  private async initializeOfflineContent(): Promise<void> {
    const defaultContent: OfflineContent[] = [
      {
        id: 'drivers',
        type: 'drivers',
        title: 'F1 Drivers',
        description: 'Complete driver profiles and statistics',
        size: 0,
        lastUpdated: new Date(),
        isAvailable: false
      },
      {
        id: 'news',
        type: 'news',
        title: 'F1 News',
        description: 'Latest Formula 1 news and updates',
        size: 0,
        lastUpdated: new Date(),
        isAvailable: false
      },
      {
        id: 'dashboard',
        type: 'dashboard',
        title: 'Dashboard',
        description: 'F1 statistics and quick stats',
        size: 0,
        lastUpdated: new Date(),
        isAvailable: false
      },
      {
        id: 'bookmarks',
        type: 'bookmarks',
        title: 'Bookmarks',
        description: 'Your saved drivers, news, and races',
        size: 0,
        lastUpdated: new Date(),
        isAvailable: false
      }
    ];

    defaultContent.forEach(content => {
      this.offlineContent.set(content.id, content);
    });

    // Load existing offline data
    await this.loadOfflineData();
  }

  // Cache content for offline viewing
  async cacheContent(type: string, data: any): Promise<boolean> {
    if (!this.preferences.enableOfflineMode) {
      return false;
    }

    try {
      const content = this.offlineContent.get(type);
      if (!content) {
        throw new Error(`Unknown content type: ${type}`);
      }

      // Check storage quota
      if (!await this.checkStorageQuota(data)) {
        throw new Error('Storage quota exceeded');
      }

      // Store data in IndexedDB
      await this.storeInIndexedDB(type, data);

      // Update content metadata
      content.size = JSON.stringify(data).length;
      content.lastUpdated = new Date();
      content.isAvailable = true;

      // Update service worker cache
      await this.updateServiceWorkerCache(type, data);

      console.log(`Content cached successfully: ${type}`);
      return true;
    } catch (error) {
      console.error(`Failed to cache content ${type}:`, error);
      return false;
    }
  }

  // Retrieve cached content
  async getCachedContent(type: string): Promise<any | null> {
    try {
      // Try IndexedDB first
      const data = await this.getFromIndexedDB(type);
      if (data) {
        return data;
      }

      // Fallback to service worker cache
      return await this.getFromServiceWorkerCache(type);
    } catch (error) {
      console.error(`Failed to retrieve cached content ${type}:`, error);
      return null;
    }
  }

  // Check if content is available offline
  isContentAvailableOffline(type: string): boolean {
    const content = this.offlineContent.get(type);
    return content?.isAvailable || false;
  }

  // Get all available offline content
  getAvailableOfflineContent(): OfflineContent[] {
    return Array.from(this.offlineContent.values()).filter(content => content.isAvailable);
  }

  // Get offline content by type
  getOfflineContentByType(type: string): OfflineContent | null {
    return this.offlineContent.get(type) || null;
  }

  // Remove cached content
  async removeCachedContent(type: string): Promise<boolean> {
    try {
      // Remove from IndexedDB
      await this.removeFromIndexedDB(type);

      // Remove from service worker cache
      await this.removeFromServiceWorkerCache(type);

      // Update content metadata
      const content = this.offlineContent.get(type);
      if (content) {
        content.size = 0;
        content.isAvailable = false;
      }

      console.log(`Content removed successfully: ${type}`);
      return true;
    } catch (error) {
      console.error(`Failed to remove cached content ${type}:`, error);
      return false;
    }
  }

  // Clear all cached content
  async clearAllCachedContent(): Promise<boolean> {
    try {
      // Clear IndexedDB
      await this.clearIndexedDB();

      // Clear service worker cache
      await this.clearServiceWorkerCache();

      // Reset content metadata
      this.offlineContent.forEach(content => {
        content.size = 0;
        content.isAvailable = false;
      });

      console.log('All cached content cleared successfully');
      return true;
    } catch (error) {
      console.error('Failed to clear cached content:', error);
      return false;
    }
  }

  // Sync offline data with server
  async syncOfflineData(): Promise<void> {
    if (!this.isOnline || !this.preferences.autoSync) {
      return;
    }

    try {
      // Get all cached content
      const cachedTypes = Array.from(this.offlineContent.keys());
      
      for (const type of cachedTypes) {
        const content = this.offlineContent.get(type);
        if (content?.isAvailable) {
          // Check if content needs updating
          const needsUpdate = await this.checkForUpdates(type);
          if (needsUpdate) {
            await this.updateCachedContent(type);
          }
        }
      }

      console.log('Offline data synced successfully');
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }

  // Check for content updates
  private async checkForUpdates(type: string): Promise<boolean> {
    try {
      const content = this.offlineContent.get(type);
      if (!content) return false;

      // Simple timestamp-based update check
      const lastUpdate = content.lastUpdated.getTime();
      const now = Date.now();
      const updateInterval = this.preferences.syncInterval * 60 * 1000; // Convert to milliseconds

      return (now - lastUpdate) > updateInterval;
    } catch (error) {
      console.error(`Failed to check for updates for ${type}:`, error);
      return false;
    }
  }

  // Update cached content
  private async updateCachedContent(type: string): Promise<void> {
    try {
      // Fetch fresh data from server
      const freshData = await this.fetchFreshData(type);
      if (freshData) {
        await this.cacheContent(type, freshData);
      }
    } catch (error) {
      console.error(`Failed to update cached content ${type}:`, error);
    }
  }

  // Fetch fresh data from server
  private async fetchFreshData(type: string): Promise<any> {
    // This would typically make API calls to fetch fresh data
    // For now, we'll return mock data
    const mockData = {
      drivers: { drivers: [] },
      news: { articles: [] },
      dashboard: { stats: {} },
      bookmarks: { bookmarks: {} }
    };

    return mockData[type as keyof typeof mockData] || null;
  }

  // Check storage quota
  private async checkStorageQuota(data: any): Promise<boolean> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const dataSize = JSON.stringify(data).length;
        const maxSize = this.preferences.maxStorageSize * 1024 * 1024; // Convert MB to bytes

        return (estimate.usage || 0) + dataSize <= maxSize;
      } catch (error) {
        console.error('Failed to check storage quota:', error);
      }
    }
    return true; // Fallback to allow caching
  }

  // IndexedDB operations
  private async storeInIndexedDB(type: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('F1RacingOffline', 2); // Increment version

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        try {
          const transaction = db.transaction(['content'], 'readwrite');
          const store = transaction.objectStore('content');
          const putRequest = store.put({ type, data, timestamp: Date.now() });

          putRequest.onerror = () => reject(putRequest.error);
          putRequest.onsuccess = () => resolve();
        } catch (error) {
          reject(error);
        }
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        
        // Delete old database if upgrading from version 1
        if (oldVersion < 2) {
          // Delete existing object stores
          if (db.objectStoreNames.contains('content')) {
            db.deleteObjectStore('content');
          }
        }
        
        // Create new object store
        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'type' });
        }
      };
    });
  }

  private async getFromIndexedDB(type: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('F1RacingOffline', 2); // Increment version

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        try {
          const transaction = db.transaction(['content'], 'readonly');
          const store = transaction.objectStore('content');
          const getRequest = store.get(type);

          getRequest.onerror = () => reject(getRequest.error);
          getRequest.onsuccess = () => {
            resolve(getRequest.result?.data || null);
          };
        } catch (error) {
          reject(error);
        }
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        
        // Delete old database if upgrading from version 1
        if (oldVersion < 2) {
          // Delete existing object stores
          if (db.objectStoreNames.contains('content')) {
            db.deleteObjectStore('content');
          }
        }
        
        // Create new object store
        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'type' });
        }
      };
    });
  }

  private async removeFromIndexedDB(type: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('F1RacingOffline', 2); // Increment version

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        try {
          const transaction = db.transaction(['content'], 'readwrite');
          const store = transaction.objectStore('content');
          const deleteRequest = store.delete(type);

          deleteRequest.onerror = () => reject(deleteRequest.error);
          deleteRequest.onsuccess = () => resolve();
        } catch (error) {
          reject(error);
        }
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        
        // Delete old database if upgrading from version 1
        if (oldVersion < 2) {
          // Delete existing object stores
          if (db.objectStoreNames.contains('content')) {
            db.deleteObjectStore('content');
          }
        }
        
        // Create new object store
        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'type' });
        }
      };
    });
  }

  private async clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('F1RacingOffline', 2); // Increment version

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        try {
          const transaction = db.transaction(['content'], 'readwrite');
          const store = transaction.objectStore('content');
          const clearRequest = store.clear();

          clearRequest.onerror = () => reject(clearRequest.error);
          clearRequest.onsuccess = () => resolve();
        } catch (error) {
          reject(error);
        }
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        
        // Delete old database if upgrading from version 1
        if (oldVersion < 2) {
          // Delete existing object stores
          if (db.objectStoreNames.contains('content')) {
            db.deleteObjectStore('content');
          }
        }
        
        // Create new object store
        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'type' });
        }
      };
    });
  }

  // Service Worker cache operations
  private async updateServiceWorkerCache(type: string, data: any): Promise<void> {
    if (this.serviceWorker) {
      this.serviceWorker.postMessage({
        type: 'CACHE_CONTENT',
        payload: { type, data }
      });
    }
  }

  private async getFromServiceWorkerCache(type: string): Promise<any> {
    if (this.serviceWorker) {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };

        this.serviceWorker!.postMessage({
          type: 'GET_CACHED_CONTENT',
          payload: { type }
        }, [messageChannel.port2]);
      });
    }
    return null;
  }

  private async removeFromServiceWorkerCache(type: string): Promise<void> {
    if (this.serviceWorker) {
      this.serviceWorker.postMessage({
        type: 'REMOVE_CACHED_CONTENT',
        payload: { type }
      });
    }
  }

  private async clearServiceWorkerCache(): Promise<void> {
    if (this.serviceWorker) {
      this.serviceWorker.postMessage({
        type: 'CLEAR_CACHE'
      });
    }
  }

  // Load offline data from storage
  private async loadOfflineData(): Promise<void> {
    try {
      const cachedTypes = ['drivers', 'news', 'dashboard', 'bookmarks'];
      
      for (const type of cachedTypes) {
        try {
          const data = await this.getFromIndexedDB(type);
          if (data) {
            const content = this.offlineContent.get(type);
            if (content) {
              content.isAvailable = true;
              content.size = JSON.stringify(data).length;
            }
          }
        } catch (typeError) {
          console.warn(`Failed to load data for type ${type}:`, typeError);
          // Continue with other types
        }
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
      throw error; // Re-throw to trigger database reset
    }
  }

  // Preferences management
  updatePreferences(newPreferences: Partial<OfflinePreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.savePreferences();
  }

  getPreferences(): OfflinePreferences {
    return { ...this.preferences };
  }

  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem('f1RacingOfflinePreferences');
      if (saved) {
        this.preferences = { ...this.preferences, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('f1RacingOfflinePreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  // Network status
  getIsOnline(): boolean {
    return this.isOnline;
  }

  // Get storage usage
  async getStorageUsage(): Promise<{ used: number; total: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          total: estimate.quota || 0
        };
      } catch (error) {
        console.error('Failed to get storage usage:', error);
      }
    }
    return { used: 0, total: 0 };
  }

  // Show update notification
  private showUpdateNotification(): void {
    // Dispatch custom event for UI to show update notification
    this.dispatchEvent('serviceWorkerUpdate', {});
  }

  // Event dispatching
  private dispatchEvent(type: string, detail: any): void {
    window.dispatchEvent(new CustomEvent(`offlineManager:${type}`, { detail }));
  }

  // Unregister service worker (for cleanup)
  async unregister(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
  }

  // Delete and recreate IndexedDB (for troubleshooting)
  async resetIndexedDB(): Promise<void> {
    try {
      // Close any existing connections
      const deleteRequest = indexedDB.deleteDatabase('F1RacingOffline');
      
      return new Promise((resolve, reject) => {
        deleteRequest.onerror = () => reject(deleteRequest.error);
        deleteRequest.onsuccess = () => {
          console.log('IndexedDB deleted successfully');
          resolve();
        };
      });
    } catch (error) {
      console.error('Failed to delete IndexedDB:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const offlineManager = OfflineManager.getInstance();
