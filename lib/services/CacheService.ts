// Cache Service
// Provides cross-platform caching with TTL support using AsyncStorage
// Fully compatible across Web, Android, and iOS

import AsyncStorage from '@react-native-async-storage/async-storage';

export class CacheService {
  /**
   * Initialize cache service
   */
  async init() {
    // AsyncStorage does not require explicit directory initialization
  }

  /**
   * Set cache item with TTL
   * @param key - Cache key identifier
   * @param data - Data to cache
   * @param ttlMs - Time-to-live in milliseconds (default: 30 minutes)
   */
  async set(key: string, data: any, ttlMs = 1800000) {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl: ttlMs,
        source: 'bmkg_api',
      };
      await AsyncStorage.setItem(`bmkg_cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Cache set failed:', key, error);
    }
  }

  /**
   * Get cache item
   * Returns null if cache doesn't exist or has expired
   * @param key - Cache key identifier
   * @returns Cached data or null if expired/not found
   */
  async get(key: string) {
    try {
      const content = await AsyncStorage.getItem(`bmkg_cache_${key}`);
      if (!content) return null;

      const cacheItem = JSON.parse(content);

      // Check if cache has expired
      if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        await AsyncStorage.removeItem(`bmkg_cache_${key}`);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Cache read failed:', key, error);
      return null;
    }
  }

  /**
   * Clear expired cache entries
   * Useful for periodic cleanup
   */
  async clearExpired() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith('bmkg_cache_'));

      for (const key of cacheKeys) {
        const content = await AsyncStorage.getItem(key);
        if (content) {
          const cacheItem = JSON.parse(content);
          if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith('bmkg_cache_'));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  }
}
