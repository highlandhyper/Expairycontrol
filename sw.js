const CACHE_NAME = "inventory-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
];

// 1. Install Event: Cache files
self.addEventListener("install", (e) => {
  console.log("[Service Worker] Installed");
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching all files");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Fetch Event: Serve from Cache if Offline
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Return cached file if found, otherwise fetch from internet
      return response || fetch(e.request);
    })
  );
});

// 3. Activate Event: Clean up old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});