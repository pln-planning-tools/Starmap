/* eslint-disable import/no-unused-modules */
import { Strategy, StrategyHandler } from 'workbox-strategies';
import Dexie from 'dexie';
import debug from 'debug';

const logger = debug('starmap:sw:CacheChildrenStrategy')
const log = {
  debug: logger.extend('debug'),
  info: logger.extend('info'),
  warn: logger.extend('warn'),
}

/**
 * A simple cache versioning strategy. If changes are made to the cache strategy, this version number should be incremented
 * in order to prevent issues like the one found in https://github.com/pln-planning-tools/Starmap/issues/345 when we switched from using
 * POST to GET requests.
 */
const CACHE_VERSION = 'v1'

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
  fetchOptions?: RequestInit  = {
    method: 'GET',
    headers: {
      'cache-control': 's-maxage=30, stale-while-revalidate=86400'
    }
  }
  async populateCacheAsync(cacheKey: string, responsePromise: Promise<Response>, handler: StrategyHandler): Promise<void> {
    const response = await responsePromise
    log.debug(`response(actual) x-vercel-cache header: ${response.headers.get('x-vercel-cache')}`)
    if (!response.ok) {
      log.warn(`populateCacheAsync(${cacheKey}) - handler.fetch response not ok: ${response.status} - ${response.statusText}`)
      return
    }
    const hashCodeStoredValue = await contentHashDB.hashes?.get({ cacheKey })
    const previousResponseHash = hashCodeStoredValue?.hashCode ?? ''
    const responseJson = await response.clone().json()
    log.debug(`populateCacheAsync(${cacheKey}) - got responseJson`)
    const currentResponseHash = generateHashCode(JSON.stringify(responseJson))

    if (previousResponseHash !== currentResponseHash) {
      log.debug(`populateCacheAsync(${cacheKey}) - previous response doesn't match latest response hash - updating response with new data`)
      await contentHashDB.hashes?.put({ cacheKey, hashCode: currentResponseHash })
      await handler.cachePut(cacheKey, response.clone())
      log.debug(`populateCacheAsync(${cacheKey}) - handler.cachePut done`)
    } else {
      log.debug(`populateCacheAsync(${cacheKey}) - previous response matches latest response hash - not updating response`)
    }
    return
  }

  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {
    try {
      const url = new URL(request.url)
      const queryParams = new URLSearchParams(url.search)

      const issue_number = queryParams.get('issue_number')
      const owner = queryParams.get('owner')
      const repo = queryParams.get('repo')
      const parentJson = queryParams.get('parentJson')
      if (!issue_number || !owner || !repo) {
        throw new Error('Invalid query parameters')
      }
      const parent = parentJson ? JSON.parse(parentJson) : null
      const node_id = parent?.node_id || ''

      // We are using the owner, repo and issue number as the cache key.
      // We are also using the parent node_id as part of the cache key.
      // This is because the children can have multiple parents.
      // That will cause cache collisions.
      const cacheKey = `${CACHE_VERSION}/${owner}/${repo}/${issue_number}/${node_id}`
      // Checking if the cache already has the response.
      let cachedResponse = await handler.cacheMatch(cacheKey)
      log.debug(`response(cached) x-vercel-cache header: ${cachedResponse?.headers?.get('x-vercel-cache')}`)

      if (cachedResponse?.status === 304 || cachedResponse?.ok){
        // We have a cached response with  200-299 (status.ok) or 304 ("Not Modified") response, return it immediately.
        return cachedResponse
      }
      /**
       * We don't have a cached response. We need to fetch the actual response, and populate the cache with it.
       */
      log.debug('No valid cached response found. Waiting for populateCacheAsync to finish')

      const actualResponse = handler.fetch(request.clone())
      const populateCachePromise = this.populateCacheAsync(cacheKey, actualResponse, handler)
      // WARNING: We're not awaiting this call deliberately. We want to populate the cache in the background.
      // Essentially, poor-man's version of stale-while-revalidate.
      // handler will wait till this promise resolves. This can be monitored using the `doneWaiting` method.
      void handler.waitUntil(populateCachePromise)
      await handler.doneWaiting()
      log.debug('populateCacheAsync finished. Returning actual response')

      return actualResponse
    } catch (error) {
      throw new Error(`Custom Caching of Children Failed with error: ${error}`)
    }
  }
}
