// Service Worker for F1 Racing Application
const CACHE_NAME = 'f1-racing-v1';
const STATIC_CACHE_NAME = 'f1-racing-static-v1';
const DYNAMIC_CACHE_NAME = 'f1-racing-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Content types to cache
const CONTENT_TYPES = ['drivers', 'news', 'dashboard', 'bookmarks'];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static file requests
  if (url.origin === self.location.origin) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle external requests (images, etc.)
  event.respondWith(handleExternalRequest(request));
});

// Handle API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Network request failed, trying cache:', error);
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response
  return new Response(
    JSON.stringify({ error: 'Offline - No cached data available' }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Handle static file requests
async function handleStaticRequest(request) {
  // Try cache first for static files
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Fallback to network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Static file request failed:', error);
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
  }
}

// Handle external requests
async function handleExternalRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('External request failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
}

// Message event - handle content caching
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'CACHE_CONTENT':
      handleCacheContent(payload);
      break;
      
    case 'GET_CACHED_CONTENT':
      handleGetCachedContent(event, payload);
      break;
      
    case 'REMOVE_CACHED_CONTENT':
      handleRemoveCachedContent(payload);
      break;
      
    case 'CLEAR_CACHE':
      handleClearCache();
      break;
      
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
  }
});

// Handle content caching
async function handleCacheContent(payload) {
  const { type, data } = payload;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put(`/api/content/${type}`, response);
    console.log(`Content cached in service worker: ${type}`);
  } catch (error) {
    console.error(`Failed to cache content ${type}:`, error);
  }
}

// Handle getting cached content
async function handleGetCachedContent(event, payload) {
  const { type } = payload;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(`/api/content/${type}`);
    
    if (response) {
      const data = await response.json();
      event.ports[0].postMessage(data);
    } else {
      event.ports[0].postMessage(null);
    }
  } catch (error) {
    console.error(`Failed to get cached content ${type}:`, error);
    event.ports[0].postMessage(null);
  }
}

// Handle removing cached content
async function handleRemoveCachedContent(payload) {
  const { type } = payload;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(`/api/content/${type}`);
    console.log(`Content removed from service worker cache: ${type}`);
  } catch (error) {
    console.error(`Failed to remove cached content ${type}:`, error);
  }
}

// Handle clearing all cache
async function handleClearCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    await Promise.all(
      requests.map(request => cache.delete(request))
    );
    
    console.log('Service worker cache cleared successfully');
  } catch (error) {
    console.error('Failed to clear service worker cache:', error);
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

// Perform background sync
async function performBackgroundSync() {
  try {
    console.log('Performing background sync...');
    
    // Sync cached content with server
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/content/')) {
        const type = request.url.split('/').pop();
        await syncContentWithServer(type);
      }
    }
    
    console.log('Background sync completed successfully');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync content with server
async function syncContentWithServer(type) {
  try {
    // This would typically make API calls to sync data
    // For now, we'll just log the sync attempt
    console.log(`Syncing content with server: ${type}`);
  } catch (error) {
    console.error(`Failed to sync content ${type}:`, error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New F1 Racing update available!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Update',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('F1 Racing', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});
