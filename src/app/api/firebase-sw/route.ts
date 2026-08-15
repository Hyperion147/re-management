/**
 * GET /api/firebase-sw
 *
 * Serves the Firebase messaging service worker with env vars injected at
 * request time. The client registers this URL as the service worker instead
 * of the static /firebase-messaging-sw.js file.
 *
 * Service workers must be served from the same origin and cannot read
 * process.env directly, so we inject the values server-side here.
 */
export async function GET() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const sw = `
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

try {
  firebase.initializeApp(${JSON.stringify(config)});
  console.log('[firebase-sw] Firebase initialized successfully');
} catch (err) {
  console.error('[firebase-sw] Failed to initialize Firebase:', err);
  throw err;
}

let messaging;
try {
  messaging = firebase.messaging();
  console.log('[firebase-sw] Firebase messaging obtained');
} catch (err) {
  console.error('[firebase-sw] Failed to get Firebase messaging:', err);
  throw err;
}

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-sw] Received background message:', payload);
  const notificationTitle = payload.notification?.title || 'New Showing Opportunity';
  const notificationOptions = {
    body: payload.notification?.body || 'A new showing request is available.',
    icon: '/next.svg',
    badge: '/next.svg',
    data: payload.data,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const opportunitiesUrl = '/client/opportunities';
      for (const client of clientList) {
        if (client.url.includes(opportunitiesUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(opportunitiesUrl);
      }
    })
  );
});
`;

  return new Response(sw, {
    headers: {
      'Content-Type': 'application/javascript',
      // Allow the browser to cache but revalidate — ensures config changes
      // are picked up without users needing to clear their SW cache
      'Cache-Control': 'no-cache',
      // Service workers require same-origin — this header is informational
      'Service-Worker-Allowed': '/',
    },
  });
}
