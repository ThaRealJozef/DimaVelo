// DimaVelo Service Worker - Network-only (No Offline Caching)
// This service worker is registered to make the app installable as a PWA
// but does NOT provide offline functionality

const CACHE_NAME = 'dima-velo-no-cache';

// Install event - no caching, just activate immediately
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing (no cache)...');
  self.skipWaiting();
});

// Activate event - clear ALL existing caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating and clearing all caches...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[Service Worker] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - ALWAYS use network, no caching
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Network-only strategy - app requires internet connection
  event.respondWith(
    fetch(request).catch((error) => {
      console.log('[Service Worker] Network request failed:', error);
      // Let the browser show its default offline page
      throw error;
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});