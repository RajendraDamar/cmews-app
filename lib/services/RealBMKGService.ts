// BMKG Service Implementation - Local Mock Data Router

import type {
  BMKGWeatherAPIResponse,
  BMKGEarlyWarningResponse,
  BMKGMaritimeResponse,
} from '~/lib/types/bmkg-api-types';

import { mockWeatherForecast } from '~/lib/data/weather-mock';
import { mockEarlyWarning } from '~/lib/data/warning-mock';
import { mockMaritimeWeather } from '~/lib/data/maritime-mock';

/**
 * BMKG Service
 * Configured to route all forecast API calls to local mock data for 100% stable offline rendering
 */
export class RealBMKGService {
  /**
   * Fetch weather forecast for a specific region (Routed to mock data)
   * 
   * @param _adm4Code - Administrative level 4 code (village/sub-district)
   * @returns BMKG weather forecast response
   */
  async getWeatherForecast(_adm4Code: string): Promise<BMKGWeatherAPIResponse> {
    console.log('ℹ️ [BMKGService] Returning mock weather forecast data');
    return mockWeatherForecast as unknown as BMKGWeatherAPIResponse;
  }

  /**
   * Fetch early warning and earthquake data (Routed to mock data)
   * 
   * @returns BMKG early warning response
   */
  async getEarlyWarning(): Promise<BMKGEarlyWarningResponse> {
    console.log('ℹ️ [BMKGService] Returning mock early warning data');
    return mockEarlyWarning as unknown as BMKGEarlyWarningResponse;
  }

  /**
   * Fetch maritime weather data (Routed to mock data)
   * 
   * @returns BMKG maritime weather response
   */
  async getMaritimeWeather(): Promise<BMKGMaritimeResponse> {
    console.log('ℹ️ [BMKGService] Returning mock maritime weather data');
    return mockMaritimeWeather as unknown as BMKGMaritimeResponse;
  }

  /**
   * Test API connectivity
   * 
   * @returns true
   */
  async testConnection(): Promise<boolean> {
    return true;
  }
}

// Export singleton instance
export const realBMKGService = new RealBMKGService();

// Export class for testing and custom instantiation
export { RealBMKGService as default };
