// Set a name for the current cache
let cacheName = 'v1';

// Which files to always cache
let cacheFiles = [
	'./',
	'./index.html',
	'./dist/build.js',
	'https://fonts.googleapis.com/css?family=Sarpanch'
]

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Installed');

  e.waitUntil(
    caches.open(cacheName).then(function(cache){
      console.log('[ServiceWorker] caching cacheFiles');

      return cache.addAll(cacheFiles);
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activated');

  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName){
        if (thisCacheName !== cacheName) {
          console.log('[ServiceWorker] Removing Cached Files From ', thisCacheName);

          return caches.delete(thisCacheName);
        }
      }))
    })
  )
})

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetching', e.request.url);

  // e.respondWidth Responds to the fetch event
  e.respondWith(
    // Check in cache for the request being made
    caches.match(e.request)
    .then(function(response) {
      // If the request is in the cache
      if (response) {
        console.log('[ServiceWorker] Found in Cache', e.request.url, response);
        // Return the cached version
        return response;
      }

      // If the request is NOT in the cache, fetch and cache
      var requestClone = e.request.clone();

      fetch(requestClone)
      .then(function(response) {
        if (!response) {
          console.log('[ServiceWorker] No response from fetch');
          return response;
        }

        var responseClone = response.clone();

        // Open the cache
        caches.open(cacheName).then(function(cache) {
          cache.put(e.request, responseClone);
          console.log('[ServiceWorker] New Data Cached', e.request.url);

          return response;
        })
      })
      .catch(function(error) {
        console.log('[ServiceWorker] Error Fetching & Caching New Data', error);
      });
    })
  )

})
