const CACHE_NAME = 'ramadan-timetable-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/hc-logo.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/api.php', // Cache the API endpoint
  '/ramadan.json' // Cache the JSON file
];

// Install event: Cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // Activate the Service Worker immediately
  );
});

// Fetch event: Serve cached assets or fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Fetch from network if not found in cache
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the API response or JSON file for future use
            if (event.request.url.includes('/api.php') || event.request.url.includes('/ramadan.json')) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            // If the network request fails (e.g., offline), serve a fallback response
            if (event.request.url.includes('/api.php')) {
              return caches.match('/ramadan.json'); // Serve the cached JSON file as a fallback
            }
            return new Response('Offline - No internet connection', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain' })
            });
          });
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});