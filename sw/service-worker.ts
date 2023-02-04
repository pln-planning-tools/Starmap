import { clientsClaim, skipWaiting } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setDefaultHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheChildren } from './CacheChildrenStrategy';


// Setting the default expiration options for the caches.
const DEFAULT_EXPIRATION_OPTIONS = {
  maxEntries: 128,
  maxAgeSeconds: 60 * 60 * 24,
  purgeOnQuotaError: true,
};

// boilerplate
skipWaiting();
clientsClaim();
// @ts-ignore: __WB_MANIFEST is a placeholder filled by workbox-webpack-plugin with the list of dependecies to be cached
const WB_MANIFEST = self.__WB_MANIFEST;
precacheAndRoute(WB_MANIFEST);

// Static Assets
registerRoute(
  /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin(DEFAULT_EXPIRATION_OPTIONS),
    ],
  }),
  'GET'
);

// Static Assets JS and CSS
registerRoute(
  /\.(?:css|js)$/i,
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        ...DEFAULT_EXPIRATION_OPTIONS,
        // Making sure we don't cache the assets for more than 1 hour. In case we need to update them.
        maxAgeSeconds: 60 * 60 * 1
      }),
    ],
  }),
  'GET'
);

// API Route for pending children
registerRoute(
  /\/api\/roadmap$/i,
  new StaleWhileRevalidate({
    cacheName: 'roadmap',
    plugins: [
      new ExpirationPlugin({
        ...DEFAULT_EXPIRATION_OPTIONS,
        maxEntries: 256
      }),
    ],
  }),
  'GET'
);

registerRoute(
  /\/api\/pendingChild$/i,
  new CacheChildren({
    cacheName: 'milestones',
    plugins: [
      new ExpirationPlugin({
        ...DEFAULT_EXPIRATION_OPTIONS,
        maxEntries: 1000,
        matchOptions: {
          ignoreVary: true
        }
      }),
    ],
  }),
  'POST'
);

cleanupOutdatedCaches();
setDefaultHandler(new NetworkFirst());
