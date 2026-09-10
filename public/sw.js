const CACHE_NAME = 'zetadu-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Never intercept or cache Firebase Auth, Google OAuth, or non-GET requests
  const url = event.request.url || '';
  if (
    event.request.method !== 'GET' ||
    url.includes('/__/auth') ||
    url.includes('google.com') ||
    url.includes('googleapis.com') ||
    url.includes('firebaseapp.com') ||
    url.includes('identitytoolkit')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
