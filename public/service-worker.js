const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX+VERSION;
const FILES_TO_CACHE = [
  "./index.html",
  "./js/index.js",
  "./js/idb.js",
  "./css/styles.css",
];

self.addEventListener('fetch', function (e) {
  console.log('fetch request: ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) {
        console.log('responding with cache: ' + e.request.url);
        return cached;
      } else {
        console.log('file is not cached, fetching: ' + e.request.url);
        return fetch(e.request);
      }
    })
  )
});

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('installing cache: ' + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  )
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      let keeps = keys.filter(k => k.indexOf(APP_PREFIX));
      keeps.push(CACHE_NAME);
      return Promise.all(keys.map((k, i) => {
        if (keeps.indexOf(k) === -1) {
          console.log('deleting cache: ' + keys[i]);
          return caches.delete(keys[i]);
        }
      }));
    })
  );
});
