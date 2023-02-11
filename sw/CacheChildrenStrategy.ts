/* eslint-disable import/no-unused-modules */
import { Strategy, StrategyHandler } from 'workbox-strategies';

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
   */
  async populateCacheAsync(cacheKey: string, request: Request, handler: StrategyHandler): Promise<void> {
    const response = await handler.fetch(request)
    handler.cachePut(cacheKey, response.clone())
  }

  /**
   *
   * @param {object} request
   * @param {object} handler
   * @returns
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined> {
    try {
      // Cloning ensures we don't consume the request here.
      const { issue_number, owner, repo } = await request.clone().json()
      // We are using the owner, repo and issue number as the cache key.
      const cacheKey = `${owner}/${repo}/${issue_number}`
      // Checking if the cache already has the response.
      const cachedResponse = await handler.cacheMatch(cacheKey)
      if (cachedResponse) {
        // WARNING: We're not awaiting this call deliberately. We want to populate the cache in the background.
        // Essentially, poor-man's version of stale-while-revalidate.
        this.populateCacheAsync(cacheKey, request, handler)
        return cachedResponse
      }
      // If the cache doesn't have the response, we populate it, and here we await the response.
      await this.populateCacheAsync(cacheKey, request, handler)
    } catch (error) {
      throw new Error(`Custom Caching of Children Failed with error: ${error}`)
    }
  }
}
