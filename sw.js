// ============================================================
//  sw.js — Service Worker · Perfusiones UCI V7
//  Estrategia network-first: siempre intenta la red, usa caché
//  como fallback offline. Así los despliegues se reciben de
//  inmediato sin tener que limpiar caché manualmente.
// ============================================================

const CACHE_NAME = "perfusiones-v7";

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
    fetch(event.request)
      .then(response => {
        // Respuesta válida: actualizar caché y devolver
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // Sin red → caché offline
  );
});
