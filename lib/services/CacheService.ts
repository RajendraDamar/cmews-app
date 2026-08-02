// Cache Service
// Provides file-based caching with TTL support using Expo FileSystem
// Supports both native (iOS/Android) and web platforms

import { Platform } from 'react-native';
import { Paths, Directory, File } from 'expo-file-system';

export class CacheService {
  private cacheDir: Directory | null = null;
  private webCache: Map<string, any> = new Map();
  private isWeb = Platform.OS === 'web';

  /**
   * Initialize cache directory
   * Creates the cache directory if it doesn't exist
   * On web, uses in-memory Map fallback
   */
  async init() {
    if (this.isWeb) {
      // Web doesn't support expo-file-system, use in-memory cache
      this.webCache = new Map();
      return;
    }

    this.cacheDir = new Directory(Paths.document, 'bmkg_cache');
    if (!this.cacheDir.exists) {
      this.cacheDir.create();
    }
  }

  /**
   * Set cache item with TTL
   * @param key - Cache key identifier
   * @param data - Data to cache
   * @param ttlMs - Time-to-live in milliseconds (default: 30 minutes)
   */
  async set(key: string, data: any, ttlMs = 1800000) {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
      source: 'bmkg_api',
    };

    if (this.isWeb) {
      // Web: use in-memory cache
      this.webCache.set(key, cacheItem);
      return;
    }

    if (!this.cacheDir) {
      console.warn('Cache directory not initialized');
      return;
    }

    const file = new File(this.cacheDir, `${key}.json`);
    await file.write(JSON.stringify(cacheItem));
  }

  /**
   * Get cache item
   * Returns null if cache doesn't exist or has expired
   * @param key - Cache key identifier
   * @returns Cached data or null if expired/not found
   */
  async get(key: string) {
    try {
      if (this.isWeb) {
        // Web: use in-memory cache
        const cacheItem = this.webCache.get(key);
        if (!cacheItem) return null;

        // Check if cache has expired
        if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
          this.webCache.delete(key);
          return null;
        }

        return cacheItem.data;
      }

      if (!this.cacheDir) {
        console.warn('Cache directory not initialized');
        return null;
      }

      const file = new File(this.cacheDir, `${key}.json`);

      if (!file.exists) return null;

      const content = await file.text();
      const cacheItem = JSON.parse(content);

      // Check if cache has expired
      if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        await file.delete();
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
      if (this.isWeb) {
        // Web: clean up in-memory cache
        for (const [key, cacheItem] of this.webCache.entries()) {
          if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
            this.webCache.delete(key);
          }
        }
        return;
      }

      if (!this.cacheDir) {
        console.warn('Cache directory not initialized');
        return;
      }

      const files = this.cacheDir.list();

      for (const item of files) {
        if (item instanceof File) {
          const content = await item.text();
          const cacheItem = JSON.parse(content);

          if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
            await item.delete();
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
      if (this.isWeb) {
        // Web: clear in-memory cache
        this.webCache.clear();
        return;
      }

      if (!this.cacheDir) {
        console.warn('Cache directory not initialized');
        return;
      }

      if (this.cacheDir.exists) {
        await this.cacheDir.delete();
        await this.init();
      }
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  }
}
