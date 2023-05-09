import { BroadcastUpdatePlugin } from 'workbox-broadcast-update';
import { clientsClaim, skipWaiting } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setDefaultHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheChildren } from './CacheChildrenStrategy';
import debug from 'debug'

globalThis.addEventListener('message', event => {
  if (event.data && event.data.type === 'DEBUG_JS_ENABLE') {
    debug.enable(event.data.debugString)
  }
})

// Setting the default expiration options for the caches.
const DEFAULT_EXPIRATION_OPTIONS = {
  maxEntries: 128,
  maxAgeSeconds: 60 * 60 * 24 * 7,   // 7 days, making sure we don't end up with sticky caches.
  purgeOnQuotaError: true,
  matchOptions: {
    ignoreVary: true
  }
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
    matchOptions: {
      ignoreVary: true
    },
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
    matchOptions: {
      ignoreVary: true
    },
    plugins: [
      new ExpirationPlugin({
        ...DEFAULT_EXPIRATION_OPTIONS,
        // Making sure we don't cache the assets for more than 1 hour. In case we need to update them.
        maxAgeSeconds: 60 * 60 * 24
      }),
    ],
  }),
  'GET'
);

// API Route for roadmap
registerRoute(
  ({ url }) => url.pathname === '/api/roadmap',
  new StaleWhileRevalidate({
    cacheName: 'roadmap',
    matchOptions: {
      ignoreVary: true
    },
    plugins: [
      new ExpirationPlugin({
        ...DEFAULT_EXPIRATION_OPTIONS,
        maxEntries: 256
      }),
      new BroadcastUpdatePlugin()
    ],
  }),
  'GET'
);

// API Route for pending children
registerRoute(
  ({ url }) => url.pathname === '/api/pendingChild',
  new CacheChildren({
    cacheName: 'milestones',
    matchOptions: {
      ignoreVary: true
    },
    plugins: [
      new ExpirationPlugin({
        ...DEFAULT_EXPIRATION_OPTIONS,
        maxEntries: 1000
      }),
      new BroadcastUpdatePlugin()
    ],
  }),
  'GET'
);

cleanupOutdatedCaches();
setDefaultHandler(new NetworkFirst());
