// Reference implementation for cache-offline-strategy skill
// Path: lib/services/CacheService.ts & ErrorHandlingService.ts

import * as FileSystem from 'expo-file-system';

export class CacheService {
  private cacheDir = `${FileSystem.documentDirectory}bmkg_cache/`;

  async init() {
    const info = await FileSystem.getInfoAsync(this.cacheDir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
    }
  }

  async set(key: string, data: any, ttl = 1800000) {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
      source: 'bmkg_api'
    };
    const filePath = `${this.cacheDir}${key}.json`;
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(cacheItem));
  }

  async get(key: string) {
    try {
      const filePath = `${this.cacheDir}${key}.json`;
      const info = await FileSystem.getInfoAsync(filePath);
      if (!info.exists) return null;

      const content = await FileSystem.readAsStringAsync(filePath);
      const cacheItem = JSON.parse(content);

      if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        await FileSystem.deleteAsync(filePath);
        return null;
      }
      return cacheItem.data;
    } catch (error) {
      console.warn('Cache read failed for key:', key, error);
      return null;
    }
  }

  async clearExpired() {
    try {
      const files = await FileSystem.readDirectoryAsync(this.cacheDir);
      for (const file of files) {
        const filePath = `${this.cacheDir}${file}`;
        const content = await FileSystem.readAsStringAsync(filePath);
        const cacheItem = JSON.parse(content);
        if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
          await FileSystem.deleteAsync(filePath);
        }
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }
}

export class BMKGErrorHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }
    throw new Error('Max retries exceeded');
  }

  static isBMKGError(error: any): boolean {
    return error.message?.includes('BMKG') ||
           (error.status >= 400 && error.status < 500);
  }
}
