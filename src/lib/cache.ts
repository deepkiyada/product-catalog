// Simple in-memory cache for production optimization
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 300000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
    
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create cache instances
export const productCache = new MemoryCache(300000); // 5 minutes for products
export const apiCache = new MemoryCache(60000); // 1 minute for API responses

// Cache key generators
export const cacheKeys = {
  allProducts: () => 'products:all',
  productById: (id: string) => `product:${id}`,
  productsByCategory: (category: string) => `products:category:${category}`,
  productsBySearch: (query: string) => `products:search:${query}`,
  featuredProducts: () => 'products:featured',
};

// Cache wrapper for functions
export function withCache<T extends any[], R>(
  fn: (...args: T) => R | Promise<R>,
  keyGenerator: (...args: T) => string,
  cache: MemoryCache = apiCache,
  ttl?: number
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args);
    
    // Try to get from cache
    const cached = cache.get<R>(key);
    if (cached !== null) {
      return cached;
    }
    
    // Execute function and cache result
    const result = await fn(...args);
    cache.set(key, result, ttl);
    
    return result;
  };
}

// Invalidate related caches when products change
export function invalidateProductCaches(productId?: string): void {
  // Clear all product-related caches
  productCache.clear();
  
  // Clear specific API caches
  const keysToDelete = [
    cacheKeys.allProducts(),
    cacheKeys.featuredProducts(),
  ];
  
  if (productId) {
    keysToDelete.push(cacheKeys.productById(productId));
  }
  
  keysToDelete.forEach(key => apiCache.delete(key));
}
