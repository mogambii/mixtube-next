/*
  Basic service worker for Next.js App Router PWA
  - Precaches core routes on install
  - Network-first for HTML/navigation
  - Stale-while-revalidate for static assets
  - Cache busting via version
*/

const VERSION = "v1";
const APP_SHELL = ["/", "/offline", "/manifest.json", "/og.jpg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(`app-shell-${VERSION}`).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Helper: SWR for static assets
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((res) => {
      if (res && res.status === 200) {
        cache.put(request, res.clone());
      }
      return res;
    })
    .catch(() => cached);
  return cached || networkFetch;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // HTML navigation: network-first to keep content fresh
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(`pages-${VERSION}`).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((r) => r || caches.match("/offline"))
        )
    );
    return;
  }

  // Static assets: images, scripts, styles -> SWR
  if (
    request.destination === "image" ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font"
  ) {
    event.respondWith(
      staleWhileRevalidate(request, `static-${VERSION}`)
    );
    return;
  }
});



