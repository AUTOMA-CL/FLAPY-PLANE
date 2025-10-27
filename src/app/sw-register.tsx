'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Solo registrar en producción y si el navegador soporta Service Workers
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Registrar Service Worker
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('✅ Service Worker registrado exitosamente:', registration);

          // Verificar actualizaciones periódicamente
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Cada hora

          // Manejar actualizaciones del SW
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Hay una nueva versión disponible
                  console.log('🔄 Nueva versión disponible. Recarga para actualizar.');

                  // Opcional: Mostrar notificación al usuario
                  if (confirm('Nueva versión disponible. ¿Deseas actualizar?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Error registrando Service Worker:', error);
        });

      // Manejar cuando el SW toma control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker actualizado, recargando...');
        window.location.reload();
      });
    } else if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Service Worker deshabilitado en desarrollo');
    }
  }, []);

  return null; // Este componente no renderiza nada
}
