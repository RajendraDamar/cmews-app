// Unified Weather Service
// Orchestrates all BMKG APIs with caching and error handling

import { RealBMKGService } from './RealBMKGService';
import { CacheService } from './CacheService';
import { ErrorHandlingService } from './ErrorHandlingService';
import { processBMKGForecast } from '../utils/bmkg-processor';
import type { ProcessedForecastResponse } from '../types/bmkg-api-types';

/**
 * Unified Weather Service
 * Orchestrates all BMKG API calls with intelligent caching and retry logic
 * 
 * Features:
 * - Automatic caching with different TTLs per data type
 * - Retry logic with exponential backoff
 * - Data validation to ensure 3-day forecast structure
 * - Graceful error handling
 */
export class WeatherService {
  private bmkgService = new RealBMKGService();
  private cacheService = new CacheService();

  /**
   * Initialize the weather service
   * Must be called before using the service
   */
  async init() {
    await this.cacheService.init();
  }

  /**
   * Get weather forecast data for a specific region
   * 
   * @param adm4Code - Administrative level 4 code (village/sub-district)
   * @returns Processed forecast with exactly 3 days of data
   * @throws Error if API request fails after retries
   * 
   * Caching: 30 minutes (BMKG updates twice daily)
   * Retries: 3 attempts with exponential backoff starting at 1 second
   */
  async getForecastData(adm4Code: string): Promise<ProcessedForecastResponse> {
    const cacheKey = `weather-${adm4Code}`;

    // Try cache first
    let cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    // Fetch from API with retry logic
    return await ErrorHandlingService.withRetry(
      async () => {
        const rawData = await this.bmkgService.getWeatherForecast(adm4Code);
        const processed = processBMKGForecast(rawData);

        // Validate exactly 3 days
        if (processed.dailyForecasts.length !== 3) {
          console.warn(
            `Invalid forecast length: ${processed.dailyForecasts.length}, expected 3`
          );
          processed.dailyForecasts = processed.dailyForecasts.slice(0, 3);
        }

        // Cache for 30 minutes
        await this.cacheService.set(cacheKey, processed, 1800000);
        return processed;
      },
      3, // maxRetries
      1000 // initialDelayMs
    );
  }

  /**
   * Get early warning and earthquake data
   * 
   * @returns Early warning data from BMKG
   * @throws Error if API request fails after retries
   * 
   * Caching: 10 minutes (real-time alerts need frequent updates)
   * Retries: 2 attempts with exponential backoff starting at 500ms
   */
  async getEarlyWarnings() {
    const cacheKey = 'early-warnings';

    let cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    return await ErrorHandlingService.withRetry(
      async () => {
        const warnings = await this.bmkgService.getEarlyWarning();
        // Cache for 10 minutes
        await this.cacheService.set(cacheKey, warnings, 600000);
        return warnings;
      },
      2, // maxRetries
      500 // initialDelayMs
    );
  }

  /**
   * Get maritime weather data
   * 
   * @returns Maritime weather data from BMKG
   * @throws Error if API request fails after retries
   * 
   * Caching: 30 minutes (maritime data updates every 6 hours)
   * Retries: 2 attempts with exponential backoff starting at 500ms
   */
  async getMaritimeData() {
    const cacheKey = 'maritime-weather';

    let cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    return await ErrorHandlingService.withRetry(
      async () => {
        const maritime = await this.bmkgService.getMaritimeWeather();
        // Cache for 30 minutes
        await this.cacheService.set(cacheKey, maritime, 1800000);
        return maritime;
      },
      2, // maxRetries
      500 // initialDelayMs
    );
  }

  /**
   * Clear all cached data
   * Useful for manual refresh or debugging
   */
  async clearCache() {
    await this.cacheService.clear();
  }

  /**
   * Clear expired cache entries
   * Useful for periodic cleanup
   */
  async clearExpiredCache() {
    await this.cacheService.clearExpired();
  }
}

// Export singleton instance
export const weatherService = new WeatherService();

// Export class for testing and custom instantiation
export { WeatherService as default };
