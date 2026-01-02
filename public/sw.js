/* eslint-disable no-restricted-globals */
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'DishiStudio';
    const options = {
        body: data.body || 'New activity in DishiStudio!',
        icon: '/logo192.png', // Ensure this exists in public/
        badge: '/favicon.ico',
        data: data.url || '/',
        vibrate: [100, 50, 100]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If a window is already open, focus it
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            // Otherwise open a new window
            return self.clients.openWindow(event.notification.data);
        })
    );
});
