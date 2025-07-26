// Service Worker for AI Art Platform PWA
const CACHE_NAME = 'ai-art-platform-v1';
const urlsToCache = [
    '/',
    '/static/css/style.css',
    '/static/js/app.js',
    '/static/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                // For image uploads and API calls, always fetch from network
                if (event.request.method === 'POST' || 
                    event.request.url.includes('/api/') ||
                    event.request.url.includes('/upload') ||
                    event.request.url.includes('/analyze') ||
                    event.request.url.includes('/enhance')) {
                    return fetch(event.request);
                }
                
                return fetch(event.request).then(function(response) {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response for cache
                    var responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Activate event
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline uploads
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-upload') {
        event.waitUntil(doBackgroundUpload());
    }
});

function doBackgroundUpload() {
    // Handle background upload when connection is restored
    return new Promise(function(resolve, reject) {
        // Check for pending uploads in IndexedDB
        // Retry failed uploads
        resolve();
    });
}

// Push notification support
self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'New notification from AI Art Platform',
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View',
                icon: '/static/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/static/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('AI Art Platform', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    console.log('Notification click received.');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});