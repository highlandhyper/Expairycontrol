const CACHE_NAME = "inventory-v11"; // Increment this number when you change code
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
];

// 1. Install Event
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// 2. Activate Event - Clean up old caches immediately
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
  self.clients.claim();
});

// 3. Fetch Event - Network First Strategy for HTML
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // DON'T cache API calls to Google Sheets
  if (url.href.includes("script.google.com")) {
    return fetch(e.request);
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // If successful, update the cache
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request)) // If offline, use cache
  );
});

