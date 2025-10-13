// Mock BMKG Service
// Simulates BMKG API calls with realistic delays for frontend development
// Will be replaced with real API service in future

import type {
  BMKGServiceInterface,
  WeatherForecastResponse,
  EarlyWarningResponse,
  MaritimeWeatherResponse,
} from './types';
import { mockWeatherForecast } from '../data/weather-mock';
import { mockEarlyWarning } from '../data/warning-mock';
import { mockMaritimeWeather } from '../data/maritime-mock';

class MockBMKGService implements BMKGServiceInterface {
  /**
   * Get weather forecast for a specific region
   * Simulates API delay of 800ms
   */
  async getWeatherForecast(wilayahCode: string): Promise<WeatherForecastResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In real implementation, this would fetch from BMKG API
    // For now, return mock data
    // TODO: Filter mock data based on wilayahCode when implementing region selection
    return mockWeatherForecast as WeatherForecastResponse;
  }

  /**
   * Get early warning alerts for a specific region or all regions
   * Simulates API delay of 600ms
   */
  async getEarlyWarning(wilayahCode?: string): Promise<EarlyWarningResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (wilayahCode) {
      // Filter warnings for specific region
      const filteredWarnings = mockEarlyWarning.peringatan.filter((warning) =>
        warning.wilayah.toLowerCase().includes(wilayahCode.toLowerCase())
      );

      return {
        peringatan: filteredWarnings.length > 0 ? filteredWarnings : mockEarlyWarning.peringatan,
      };
    }

    return mockEarlyWarning;
  }

  /**
   * Get maritime weather data for all waters
   * Simulates API delay of 1000ms
   */
  async getMaritimeWeather(): Promise<MaritimeWeatherResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return mockMaritimeWeather as MaritimeWeatherResponse;
  }
}

// Export singleton instance
export const bmkgService = new MockBMKGService();

// Export class for testing purposes
export { MockBMKGService };
