import { NextRequest } from 'next/server'

// Simple in-memory cache for development
// In production, use Redis or a proper caching solution
class MemoryCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map()

  set(key: string, data: any, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000)
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)

    if (!item) return null

    if (item.expiry < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    for (const [key, item] of entries) {
      if (item.expiry < now) {
        this.cache.delete(key)
      }
    }
  }
}

const cache = new MemoryCache()

// Clean up expired entries every 5 minutes
setInterval(() => {
  cache.cleanup()
}, 5 * 60 * 1000)

export { cache }

// Cache key generators
export const generateCacheKey = {
  places: (city?: string, category?: string, limit?: number, offset?: number) =>
    `places:${city || 'all'}:${category || 'all'}:${limit || 'all'}:${offset || 0}`,

  place: (id: string) => `place:${id}`,

  reviews: (placeId: string, page?: number) =>
    `reviews:${placeId}:${page || 1}`,

  userFavorites: (userId: string) => `favorites:${userId}`,

  cityStats: (city: string) => `stats:${city}`,

  analytics: () => `analytics:global`
}

// Cache utilities
export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const cached = cache.get(key)

  if (cached !== null) {
    return cached
  }

  const data = await fetchFn()
  cache.set(key, data, ttlSeconds)

  return data
}

export function invalidateCache(pattern: string): void {
  // Simple pattern matching for cache invalidation
  const keys = Array.from(cache['cache'].keys())
  for (const key of keys) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

// ETags for HTTP caching
export function generateETag(data: any): string {
  const hash = require('crypto')
    .createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex')
  return `"${hash}"`
}

export function checkETag(request: NextRequest, etag: string): boolean {
  const ifNoneMatch = request.headers.get('if-none-match')
  return ifNoneMatch === etag
}