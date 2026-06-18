const CACHE_NAME = 'global-ai-labs-media-cache-v1';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const isImage = request.destination === 'image' || request.url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/);
  const isVideo = request.destination === 'video' || request.url.match(/\.(mp4|webm|ogg)$/);

  if (isImage || isVideo) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        // We match by URL to handle requests with differing Range headers correctly
        return cache.match(request.url).then((cachedResponse) => {
          const now = Date.now();

          // If cache hit and not expired
          if (cachedResponse) {
            const dateHeader = cachedResponse.headers.get('date');
            if (dateHeader) {
              const cachedTime = new Date(dateHeader).getTime();
              if (now - cachedTime < EXPIRATION_TIME) {
                // Return range response for videos if requested
                if (request.headers.has('range')) {
                  return returnRangeResponse(request, cachedResponse);
                }
                return cachedResponse;
              }
            }
          }

          // Cache miss or expired: fetch fresh copy
          // If it's a range request, we request the full file first so we can cache the full resource.
          const fetchRequest = (isVideo && request.headers.has('range'))
            ? new Request(request.url, { headers: { 'Accept': request.headers.get('accept') } })
            : request;

          return fetch(fetchRequest).then((networkResponse) => {
            if (networkResponse.status === 200) {
              const headers = new Headers(networkResponse.headers);
              headers.set('date', new Date().toUTCString());

              const clonedResponse = new Response(networkResponse.body, {
                status: networkResponse.status,
                statusText: networkResponse.statusText,
                headers: headers
              });

              cache.put(request.url, clonedResponse.clone());

              if (request.headers.has('range')) {
                return returnRangeResponse(request, clonedResponse);
              }
              return networkResponse;
            }
            return networkResponse;
          }).catch(() => {
            // Offline fallback: serve cached file even if expired
            if (cachedResponse) {
              if (request.headers.has('range')) {
                return returnRangeResponse(request, cachedResponse);
              }
              return cachedResponse;
            }
          });
        });
      })
    );
  }
});

// Helper function to handle 206 Partial Content range responses
function returnRangeResponse(request, response) {
  return response.blob().then((blob) => {
    const rangeHeader = request.headers.get('range');
    const match = rangeHeader.match(/^bytes=(\d+)-(\d+)?$/);
    if (!match) {
      return new Response(blob, {
        status: 200,
        headers: response.headers
      });
    }

    const start = parseInt(match[1], 10);
    const end = match[2] ? parseInt(match[2], 10) : blob.size - 1;
    const slicedBlob = blob.slice(start, end + 1);

    const headers = new Headers(response.headers);
    headers.set('Content-Range', `bytes ${start}-${end}/${blob.size}`);
    headers.set('Content-Length', slicedBlob.size);

    return new Response(slicedBlob, {
      status: 206,
      statusText: 'Partial Content',
      headers: headers
    });
  });
}
