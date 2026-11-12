const CACHE_NAME = 'eshraqat-v3';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

// تثبيت الخدمة وتخزين الملفات الأساسية
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assetsToCache))
  );
});

// حذف الكاش القديم وتفعيل النسخة الجديدة فوراً
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// جلب الملفات: من الكاش أولاً، ثم الشبكة، مع صفحة بديلة عند انقطاع الإنترنت
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // لا نتدخل في الطلبات غير GET، ولا في الصوتيات (range)، ولا في الموارد الخارجية
  if (req.method !== 'GET') return;
  if (req.destination === 'audio' || req.destination === 'video' || req.headers.has('range')) return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).catch(() => {
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
