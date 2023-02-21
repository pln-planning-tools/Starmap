/* eslint-disable import/no-unused-modules */
import { Strategy, StrategyHandler } from 'workbox-strategies';
import Dexie from 'dexie';

// Based on Java's hashCode implementation: https://stackoverflow.com/a/7616484/104380
const generateHashCode = str => [...str].reduce((hash, chr) => 0 | (31 * hash + chr.charCodeAt(0)), 0)

const contentHashDB: {hashes?: Dexie.Table} & Dexie = new Dexie('contentHashDB')
contentHashDB.version(1).stores({
  hashes: `cacheKey, hashCode`
});


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
    const response = await handler.fetch(request.clone())
    if (!response.ok) {
      return
    }
    const hashCodeStoredValue = await contentHashDB.hashes?.get({ cacheKey })
    const previousResponseHash = hashCodeStoredValue?.hashCode ?? ''
    const currentResponseHash = generateHashCode(JSON.stringify(await response.clone().json()))

    if (previousResponseHash !== currentResponseHash) {
      contentHashDB.hashes?.put({ cacheKey, hashCode: currentResponseHash })
      await handler.cachePut(cacheKey, response.clone())
    }
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
      let cachedResponse = await handler.cacheMatch(cacheKey)
      // WARNING: We're not awaiting this call deliberately. We want to populate the cache in the background.
      // Essentially, poor-man's version of stale-while-revalidate.
      // handler will wait till this promise resolves. This can be monitored using the `doneWaiting` method.
      handler.waitUntil(this.populateCacheAsync(cacheKey, request, handler))
      if (!cachedResponse) {
        await handler.doneWaiting()
        cachedResponse = await handler.cacheMatch(cacheKey)
      }

      return cachedResponse
    } catch (error) {
      throw new Error(`Custom Caching of Children Failed with error: ${error}`)
    }
  }
}
