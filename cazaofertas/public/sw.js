/* Service Worker for CazaOfertas - Handles push notifications and offline capabilities */

// Cache name
const CACHE_NAME = 'cazaofertas-cache-v1';

// Assets to cache on install - These are aligned with Vite's output
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/dist/index.html',
  '/dist/assets/',
  '/assets/icons/notification-icon.png',
  '/assets/icons/notification-badge.png',
  '/assets/icons/action-icon.png'
];

// Install event - caches static assets with error handling
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        // Cache files one by one to handle failures gracefully
        return Promise.all(
          CACHE_ASSETS.map(url => 
            cache.add(url).catch(error => {
              console.warn(`Failed to cache ${url}:`, error);
              return null;
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - for offline support with network-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response since it can only be consumed once
        const responseToCache = response.clone();
        
        // Cache the fetched response for future offline use
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          })
          .catch(error => {
            console.warn('Failed to cache response:', error);
          });
          
        return response;
      })
      .catch(() => {
        // If network request fails, try to get from cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            // If not in cache and network failed, return offline fallback
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Offline content not available');
          });
      })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', event => {
  console.log('Push message received:', event);
  try {
    const data = event.data.json();
    
    const options = {
      body: data.message,
      icon: data.icon || '/assets/icons/notification-icon.png',
      badge: data.badge || '/assets/icons/notification-badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id || 1,
        url: data.url || '/'
      },
      actions: data.actions || [
        {
          action: 'explore',
          title: 'Ver detalles',
          icon: '/assets/icons/action-icon.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'CazaOfertas', options)
    );
  } catch (error) {
    console.error('Error parsing push notification data:', error);
    
    // Show a default notification if data is malformed
    event.waitUntil(
      self.registration.showNotification('Nueva notificación de CazaOfertas', {
        body: 'Tienes una nueva notificación',
        icon: '/path/to/notification-icon.png'
      })
    );
  }
});

// Notification click event - handle notification interaction
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  // Get the notification data
  const url = event.notification.data?.url || '/';
  
  // Handle different actions
  if (event.action === 'explore') {
    // Custom action handling
    console.log('User clicked "explore" action');
  }
  
  // Open or focus the relevant page
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(windowClients => {
        // Check if there's already a window/tab open with the target URL
        for (const client of windowClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
