import { clientsClaim, skipWaiting } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setDefaultHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { Strategy } from 'workbox-strategies';

/**
 * This is a custom strategy to cache the milestone children of a Starmap.
 * The benefit of writing this as a workbox strategy is we can use other workbox plugins like expiration.
 */
class CacheChildren extends Strategy {

  /**
   *
   * @param {string} cacheKey
   * @param {object} request
   * @param {object} handler
   * @returns
   */
  async populateCacheAsync(cacheKey, request, handler) {
    const response = await handler.fetch(request)
    handler.cachePut(cacheKey, response.clone())
    return response
  }

  /**
   *
   * @param {object} request
   * @param {object} handler
   * @returns
   */
  async _handle(request, handler) {
    try {
      // Cloning ensures we don't consume the request here.
      const { issue_number, owner } = await request.clone().json()
      // We are using the owner and issue number as the cache key.
      const cacheKey = `child-${owner}-${issue_number}`
      // Checking if the cache already has the response.
      const cachedResponse = await handler.cacheMatch(cacheKey)
      if (cachedResponse) {
        // WARNING: We're not awaiting this call deliberately. We want to populate the cache in the background.
        // Essentially, poor-man's version of stale-while-revalidate.
        this.populateCacheAsync(cacheKey, request, handler)
        return cachedResponse
      }
      // If the cache doesn't have the response, we populate it, and here we await the response.
      return await this.populateCacheAsync(cacheKey, request, handler)
    } catch (error) {
      throw new Error(`Custom Caching of Children Failed with error: ${error}`)
    }
  }
}


// Setting the default expiration options for the caches.
const DEFAULT_EXPIRATION_OPTIONS = {
  maxEntries: 128,
  maxAgeSeconds: 60 * 60 * 24,
  purgeOnQuotaError: true,
};

// boilerplate
skipWaiting();
clientsClaim();
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
