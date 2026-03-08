const cacheName = 'mertule-pro-v2026';
const assets = ['./', './index.html', './style.css', './app.js', './manifest.json', './icon.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)))));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request).then(fetchRes => {
    return caches.open(cacheName).then(cache => {
      cache.put(e.request.url, fetchRes.clone());
      return fetchRes;
    });
  })));
});
