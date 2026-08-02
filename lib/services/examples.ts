// Example usage of Cache, Network, and Error Handling Services
// This file demonstrates how to use the new services

import { CacheService } from './CacheService';
import { NetworkService } from './NetworkService';
import { ErrorHandlingService, APIError } from './ErrorHandlingService';

/**
 * Example 1: Using CacheService
 */
export async function exampleCacheUsage() {
  const cache = new CacheService();
  await cache.init();

  // Save data with 30-minute TTL (default)
  await cache.set('weather-jakarta', {
    temperature: 28,
    humidity: 75,
    weather: 'Cerah Berawan',
  });

  // Save data with custom 10-minute TTL (for early warnings)
  await cache.set(
    'early-warnings',
    { warnings: ['Cuaca Ekstrem di Jawa Barat'] },
    600000 // 10 minutes in milliseconds
  );

  // Retrieve cached data
  const weatherData = await cache.get('weather-jakarta');
  console.log('Cached weather:', weatherData);

  // Clear expired entries
  await cache.clearExpired();

  // Clear all cache
  // await cache.clear();
}

/**
 * Example 2: Using NetworkService
 */
export async function exampleNetworkUsage() {
  const network = new NetworkService();

  try {
    // Simple GET request
    const data = await network.get('https://api.example.com/weather');
    console.log('Weather data:', data);

    // GET request with retry
    const dataWithRetry = await network.requestWithRetry(
      'https://api.example.com/weather',
      { method: 'GET' },
      3 // max 3 retries
    );
    console.log('Weather data (with retry):', dataWithRetry);

    // POST request
    const postData = await network.post(
      'https://api.example.com/feedback',
      {
        user: 'user123',
        message: 'Great app!',
      }
    );
    console.log('Post response:', postData);

    // Check connectivity
    const isOnline = await network.checkConnectivity();
    console.log('Network status:', isOnline ? 'Online' : 'Offline');
  } catch (error) {
    if (error instanceof APIError) {
      console.error('API Error:', error.message, 'Status:', error.statusCode);
    }
  }
}

/**
 * Example 3: Using ErrorHandlingService
 */
export async function exampleErrorHandlingUsage() {
  // Retry a failing operation with exponential backoff
  try {
    const result = await ErrorHandlingService.withRetry(
      async () => {
        // Simulated API call that might fail
        const response = await fetch('https://api.bmkg.go.id/publik/prakiraan-cuaca');
        if (!response.ok) {
          throw new APIError('Weather API failed', response.status, response.url);
        }
        return await response.json();
      },
      3, // max retries
      1000 // initial delay (1 second)
    );
    console.log('Weather data:', result);
  } catch (error) {
    // Get user-friendly error message
    const message = ErrorHandlingService.getUserFriendlyMessage(error);
    console.error('Error:', message);

    // Check error type
    if (ErrorHandlingService.isBMKGError(error)) {
      console.log('This is a BMKG API error');
    }
    if (ErrorHandlingService.isNetworkError(error)) {
      console.log('This is a network error');
    }
  }
}

/**
 * Example 4: Combined usage - Cached API call with retry
 */
export async function exampleCombinedUsage(wilayahCode: string) {
  const cache = new CacheService();
  const network = new NetworkService();

  await cache.init();

  // Check cache first
  const cacheKey = `weather-${wilayahCode}`;
  let weatherData = await cache.get(cacheKey);

  if (weatherData) {
    console.log('Using cached data:', weatherData);
    return weatherData;
  }

  // Cache miss - fetch from API with retry
  try {
    weatherData = await ErrorHandlingService.withRetry(
      async () => {
        return await network.get(
          `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${wilayahCode}`
        );
      },
      3,
      1000
    );

    // Cache the result for 30 minutes
    await cache.set(cacheKey, weatherData, 1800000);

    console.log('Fetched and cached new data:', weatherData);
    return weatherData;
  } catch (error) {
    const message = ErrorHandlingService.getUserFriendlyMessage(error);
    console.error('Failed to fetch weather data:', message);
    throw error;
  }
}
