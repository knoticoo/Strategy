// Service Worker for Budget & Property Hub Latvia
const CACHE_NAME = 'budget-hub-lv-v1.2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/house-search',
  // Cache essential fonts and icons
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js',
  // Cache map tiles for Riga area
  'https://a.tile.openstreetmap.org/11/1192/630.png',
  'https://b.tile.openstreetmap.org/11/1192/630.png',
  'https://c.tile.openstreetmap.org/11/1192/630.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ All resources cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache installation failed:', error);
      })
  );
});

// Fetch events
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Cache-first strategy for static assets
    if (request.url.includes('/static/') || 
        request.url.includes('fonts.googleapis.com') ||
        request.url.includes('cdnjs.cloudflare.com')) {
      event.respondWith(
        caches.match(request)
          .then((response) => {
            if (response) {
              return response;
            }
            return fetch(request).then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
              return response;
            });
          })
      );
      return;
    }

    // Network-first strategy for API calls
    if (request.url.includes('/api/') || 
        request.url.includes('ss.lv') ||
        request.url.includes('revolut.com')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache successful API responses for 5 minutes
            if (response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME + '-api')
                .then((cache) => {
                  cache.put(request, responseToCache);
                  // Remove from cache after 5 minutes
                  setTimeout(() => {
                    cache.delete(request);
                  }, 5 * 60 * 1000);
                });
            }
            return response;
          })
          .catch(() => {
            // Return cached version if network fails
            return caches.match(request);
          })
      );
      return;
    }

    // Stale-while-revalidate for pages
    event.respondWith(
      caches.match(request)
        .then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, networkResponse.clone());
              });
            return networkResponse;
          });
          return response || fetchPromise;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        })
    );
  }
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== CACHE_NAME + '-api') {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'transaction-sync') {
    event.waitUntil(syncTransactions());
  } else if (event.tag === 'property-alert-check') {
    event.waitUntil(checkPropertyAlerts());
  }
});

// Push notifications for price alerts
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  let notificationData = {
    title: 'Budget Hub LV',
    body: 'You have a new notification',
    icon: '/logo192.png',
    badge: '/icons/badge-96.png',
    tag: 'general'
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        tag: data.tag || notificationData.tag,
        data: data.url ? { url: data.url } : null
      };
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/view-24.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/dismiss-24.png'
        }
      ],
      requireInteraction: true
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.focus();
              return client.navigate(urlToOpen);
            }
          }
          // Open new window
          if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Utility functions
async function syncTransactions() {
  try {
    console.log('🔄 Syncing offline transactions...');
    // Get offline transactions from IndexedDB
    const transactions = await getOfflineTransactions();
    
    for (const transaction of transactions) {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction),
        });
        
        if (response.ok) {
          await removeOfflineTransaction(transaction.id);
          console.log('✅ Transaction synced:', transaction.id);
        }
      } catch (error) {
        console.error('❌ Failed to sync transaction:', transaction.id, error);
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

async function checkPropertyAlerts() {
  try {
    console.log('🔍 Checking property price alerts...');
    const response = await fetch('/api/property-alerts/check', {
      method: 'POST'
    });
    
    if (response.ok) {
      const alerts = await response.json();
      
      for (const alert of alerts) {
        await self.registration.showNotification('🏠 Property Alert', {
          body: `New property found under €${alert.maxPrice}: ${alert.propertyTitle}`,
          icon: '/logo192.png',
          tag: 'property-alert',
          data: { url: `/house-search?property=${alert.propertyId}` },
          actions: [
            { action: 'view', title: 'View Property' },
            { action: 'dismiss', title: 'Dismiss' }
          ]
        });
      }
    }
  } catch (error) {
    console.error('❌ Property alert check failed:', error);
  }
}

// IndexedDB utilities (simplified versions)
async function getOfflineTransactions() {
  // Return empty array for now - in real app, would use IndexedDB
  return [];
}

async function removeOfflineTransaction(id) {
  // Remove from IndexedDB - implementation would go here
  console.log('Removed offline transaction:', id);
}

// Message handling
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});