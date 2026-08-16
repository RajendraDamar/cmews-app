---
name: cache-offline-strategy
description: Offline data caching and error handling strategy for cmews-app — covers CacheService with expo-file-system, TTL rules, retry logic with exponential backoff, and network error recovery.
---

# Cache & Offline Strategy Skill

This skill covers the caching, offline support, and error handling architecture for cmews-app's BMKG API integration.

## Cache TTL Rules

| Data Type | TTL | Rationale |
|:---|:---|:---|
| Weather forecast | 30 minutes (1,800,000ms) | BMKG updates twice daily |
| Early warnings | 10 minutes (600,000ms) | Safety-critical, needs fresher data |
| Maritime weather | 30 minutes (1,800,000ms) | Updates every 6 hours |

## CacheService Implementation

Uses `expo-file-system` for persistent file-based caching:

```typescript
// lib/services/CacheService.ts
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
```

## Error Handling — Retry with Exponential Backoff

```typescript
// lib/services/ErrorHandlingService.ts
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
```

## WeatherService — Caching Layer

```typescript
// lib/services/WeatherService.ts
export class WeatherService {
  private bmkgService = new BMKGService();
  private cacheService = new CacheService();

  async getForecastData(wilayahCode: string) {
    const cacheKey = `weather-${wilayahCode}`;
    let cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const rawData = await this.bmkgService.getWeatherForecast(wilayahCode);
    const processed = processBMKGForecast(rawData);
    await this.cacheService.set(cacheKey, processed, 1800000);
    return processed;
  }

  async getEarlyWarnings() {
    const cacheKey = 'early-warnings';
    let cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const warnings = await this.bmkgService.getEarlyWarning();
    await this.cacheService.set(cacheKey, warnings, 600000);
    return warnings;
  }

  async getMaritimeData() {
    const cacheKey = 'maritime-weather';
    let cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const maritime = await this.bmkgService.getMaritimeWeather();
    await this.cacheService.set(cacheKey, maritime, 1800000);
    return maritime;
  }
}
```

## Zustand Store Pattern

```typescript
// store/weatherStore.ts — key patterns
const weatherService = new WeatherService();

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  forecast: [],
  loading: false,
  error: null,

  fetchWeatherData: async (wilayahCode: string) => {
    set({ loading: true, error: null });
    try {
      const data = await weatherService.getForecastData(wilayahCode);
      set({
        currentWeather: data.dailyForecasts[0]?.[0] || null,
        forecast: data.dailyForecasts,
        lastUpdated: data.lastUpdated,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Weather fetch failed',
        loading: false
      });
    }
  },

  refreshAllData: async (wilayahCode: string) => {
    const { fetchWeatherData, fetchEarlyWarnings, fetchMaritimeData } = get();
    await Promise.all([
      fetchWeatherData(wilayahCode),
      fetchEarlyWarnings(),
      fetchMaritimeData()
    ]);
  }
}));
```

## API Integration Rules
- Always implement caching for BMKG API calls
- Handle network failures gracefully with user-friendly messages
- Implement retry logic with exponential backoff
- Validate data structure before processing
- Log API errors for debugging
