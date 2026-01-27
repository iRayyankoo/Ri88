const CACHE_NAME = 'ri88-pwa-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/tools.html',
    '/sports.html',
    '/about.html',
    '/assets/styles.css',
    '/assets/app.js',
    '/assets/logo.png',
    '/assets/lucide.js',
    '/manifest.json'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Event: Cleanup Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Cache First, Network Fallback
self.addEventListener('fetch', (event) => {
    // Bypass cache for API calls (Sports Data) to ensure live results
    if (event.request.url.includes('/api/') || event.request.url.includes('?q=')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Standard Cache Strategy
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((networkResponse) => {
                // Optional: Cache new requests on the fly? 
                // For now, keep it simple to avoid caching bad responses
                return networkResponse;
            });
        })
    );
});
