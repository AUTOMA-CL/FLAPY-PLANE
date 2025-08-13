// Service Worker para PWA - Flappy Plane
const CACHE_NAME = 'flappy-plane-v1';
const urlsToCache = [
  '/',
  '/game',
  '/images/plane.png',
  '/images/background.jpeg',
  '/images/background-new.jpeg',
  '/images/FE_NUEVOLOGO(avion)_AZUL.png',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Error en cache:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones - Network First Strategy
self.addEventListener('fetch', (event) => {
  // Para las API de Google Sheets, siempre ir a la red
  if (event.request.url.includes('script.google.com') || 
      event.request.url.includes('analytics')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Para el resto de recursos, intentar red primero, cache como fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clonar la respuesta antes de guardarla en cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en cache
        return caches.match(event.request);
      })
  );
});

// Manejar notificaciones push (futuro)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Flappy Plane', options)
  );
});