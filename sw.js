const CACHE_NAME = 'eshraqat-v2';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// تثبيت الخدمة
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// جلب الملفات بسلاسة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});