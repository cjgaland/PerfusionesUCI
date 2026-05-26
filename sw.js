// ============================================================
//  sw.js — Service Worker · Perfusiones UCI V6
//  Incrementar CACHE_NAME para forzar actualización en usuarios
// ============================================================

const CACHE_NAME = "perfusiones-v6";

const ASSETS = [
  "./index.html",
  "./styles.css",
  "./app.js",
  "./farmacos.js",
  "./manifest.json",
  "./icon-192.svg",
  "./icon-512.svg",
  "./icon-180.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== "basic") return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
