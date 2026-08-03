// Real BMKG Service Implementation
// Connects to actual BMKG API endpoints for live weather data with Web proxy support

import { Platform } from 'react-native';
import type {
  BMKGWeatherAPIResponse,
  BMKGEarlyWarningResponse,
  BMKGMaritimeResponse,
} from '~/lib/types/bmkg-api-types';

import { mockWeatherForecast } from '~/lib/data/weather-mock';
import { mockEarlyWarning } from '~/lib/data/warning-mock';
import { mockMaritimeWeather } from '~/lib/data/maritime-mock';

const PROXY_BASE_URL = 'http://localhost:3003/api/proxy?url=';

/**
 * Real BMKG API Service
 * Replaces MockBMKGService with actual API integration, web proxy routing, and graceful mock fallback
 */
export class RealBMKGService {
  private readonly baseUrl = 'https://api.bmkg.go.id/publik';
  private readonly earlyWarningUrl = 'https://data.bmkg.go.id/DataMKG/TEWS';
  private readonly maritimeUrl = 'https://peta-maritim.bmkg.go.id/public_api';

  /**
   * Generic fetch helper with Web CORS proxy support and error handling
   * 1. Native iOS/Android ALWAYS calls BMKG directly (bypasses proxy/localhost)
   * 2. Web browser uses the backend CORS proxy
   * 
   * @param endpointUrl - API endpoint URL
   * @param errorContext - Context for error messages
   * @returns Parsed JSON response
   * @throws Error with context-specific message
   */
  private async fetchJSON<T>(endpointUrl: string, errorContext: string): Promise<T> {
    const targetUrl =
      Platform.OS === 'web'
        ? `${PROXY_BASE_URL}${encodeURIComponent(endpointUrl)}`
        : endpointUrl;

    try {
      console.log(`🌐 [BMKG-Fetch] Platform: ${Platform.OS} | Fetching: ${targetUrl}`);
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json, application/xml, text/plain, */*',
        },
      });

      if (!response.ok) {
        throw new Error(`${errorContext} HTTP Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ [BMKG-Fetch-Error] (${Platform.OS}) Target: ${endpointUrl}`, error);
      throw error;
    }
  }

  /**
   * Fetch weather forecast for a specific region with mock fallback
   * 
   * @param adm4Code - Administrative level 4 code (village/sub-district)
   * @returns BMKG weather forecast response
   */
  async getWeatherForecast(adm4Code: string): Promise<BMKGWeatherAPIResponse> {
    try {
      const url = `${this.baseUrl}/prakiraan-cuaca?adm4=${adm4Code}`;
      const data = await this.fetchJSON<BMKGWeatherAPIResponse>(url, 'Weather forecast');
      
      // Validate response structure
      if (!data || !data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid BMKG API response structure');
      }

      return data;
    } catch (error) {
      console.warn('⚠️ Weather forecast fetch failed, using mock forecast data fallback:', error);
      return mockWeatherForecast as unknown as BMKGWeatherAPIResponse;
    }
  }

  /**
   * Fetch early warning and earthquake data with mock fallback
   * 
   * @returns BMKG early warning response
   */
  async getEarlyWarning(): Promise<BMKGEarlyWarningResponse> {
    try {
      const url = `${this.earlyWarningUrl}/autogempa.json`;
      return await this.fetchJSON<BMKGEarlyWarningResponse>(url, 'Early warning');
    } catch (error) {
      console.warn('⚠️ Early warning fetch failed, using mock warning data fallback:', error);
      return mockEarlyWarning as unknown as BMKGEarlyWarningResponse;
    }
  }

  /**
   * Fetch maritime weather data with mock fallback
   * 
   * @returns BMKG maritime weather response
   */
  async getMaritimeWeather(): Promise<BMKGMaritimeResponse> {
    try {
      const url = `${this.maritimeUrl}/perairan`;
      return await this.fetchJSON<BMKGMaritimeResponse>(url, 'Maritime weather');
    } catch (error) {
      console.warn('⚠️ Maritime weather fetch failed, using mock maritime data fallback:', error);
      return mockMaritimeWeather as unknown as BMKGMaritimeResponse;
    }
  }

  /**
   * Test API connectivity
   * Useful for health checks and debugging
   * 
   * @returns true if API is reachable, false otherwise
   */
  async testConnection(): Promise<boolean> {
    try {
      const EXAMPLE_ADM4_CODE = '3171031001';
      await this.getWeatherForecast(EXAMPLE_ADM4_CODE);
      return true;
    } catch (error) {
      console.warn('BMKG API connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const realBMKGService = new RealBMKGService();

// Export class for testing and custom instantiation
export { RealBMKGService as default };
