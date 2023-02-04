/* eslint-disable import/no-unused-modules */
import { Strategy } from 'workbox-strategies';

/**
 * This is a custom strategy to cache the milestone children of a Starmap.
 * The benefit of writing this as a workbox strategy is we can use other workbox plugins like expiration.
 */
export class CacheChildren extends Strategy implements Strategy {

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
