const CACHE_NAME = 'damas-cache-v1';
const PRECACHE_URLS = [
//   '/',
  '/index.html',
  '/styles.css',
  '/index.js',
  '/functions.js',
  '/data.js',
  '/share.js',
   '/about.html',
  '/offline.html',
  '/Favicons/site.webmanifest',
  '/Favicons/android-chrome-192x192.png',
  '/Favicons/android-chrome-512x512.png',
  '/Favicons/favicon-32x32.png',
  '/Favicons/favicon-16x16.png',
  '/Favicons/apple-touch-icon.png',
  '/Favicons/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Simple runtime caching: try cache first, then network, fallback to offline page
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Navigation requests: serve cached index or offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // For other requests: respond from cache, then network, else fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // Save a copy of the response in cache for next time
          const shouldCache = request.method === 'GET' && response && response.status === 200;
          if (shouldCache) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          // If image request, optionally return a placeholder (not provided)
          if (request.destination === 'image') return caches.match('/assets/placeholder.png');
          return caches.match('/offline.html');
        });
    })
  );
});

// Listen for skipWaiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// End of service-worker.js
