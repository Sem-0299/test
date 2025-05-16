const CACHE_NAME = 'contacts-pwa-v1';
const URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/js/storage.js',
  '/manifest.json',
  '/icons/contact-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
