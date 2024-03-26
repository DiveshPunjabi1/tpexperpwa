// var staticCacheName = "pwa";

// self.addEventListener("install", function (e) {
// e.waitUntil(
// 	caches.open(staticCacheName).then(function (cache) {
// 	return cache.addAll(["/"]);
// 	})
// );
// });

// self.addEventListener("fetch", function (event) {
// console.log(event.request.url);

// event.respondWith(
// 	caches.match(event.request).then(function (response) {
// 	return response || fetch(event.request);
// 	})
// );
// });
// service-worker.js


const CACHE_NAME = 'my-ecommerce-app-cache-v1';
const urlsToCache = [
  '/',
  
  'index.html',
  
  'style.css',
  
  'service-worker.js',
  'manifest.json'


  // Add more files to cache as needed
];


self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache)
            .catch(function(error) {
              console.error('Cache.addAll error:', error);
            });
        })
    );
  });


self.addEventListener('activate', function(event) {
  // Perform activation steps
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
