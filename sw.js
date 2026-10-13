// Kill switch. An earlier version of this file cached images/videos, but its fetch handler had a
// bug: the first request for each image (and every one after the 24h cache expiry) returned a
// consumed response body, so logos and photos showed as broken images. Browsers that registered
// that worker keep running it until it is replaced, so this version removes itself and its caches.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => clients.forEach((client) => client.navigate(client.url)))
  );
});
// No fetch handler on purpose: every request goes straight to the network.
