// Real BMKG Service Implementation
// Connects to actual BMKG API endpoints for live weather data

import type {
  BMKGWeatherAPIResponse,
  BMKGEarlyWarningResponse,
  BMKGMaritimeResponse,
} from '~/lib/types/bmkg-api-types';

/**
 * Real BMKG API Service
 * Replaces MockBMKGService with actual API integration
 */
export class RealBMKGService {
  private readonly baseUrl = 'https://api.bmkg.go.id/publik';
  private readonly earlyWarningUrl = 'https://data.bmkg.go.id/DataMKG/TEWS';
  private readonly maritimeUrl = 'https://peta-maritim.bmkg.go.id/public_api';

  /**
   * Generic fetch helper with error handling
   * Reduces code duplication across API methods
   * 
   * @param url - API endpoint URL
   * @param errorContext - Context for error messages
   * @returns Parsed JSON response
   * @throws Error with context-specific message
   */
  private async fetchJSON<T>(url: string, errorContext: string): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `${errorContext} error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${errorContext}:`, error);
      
      if (error instanceof Error) {
        throw new Error(`${errorContext} fetch failed: ${error.message}`);
      }
      
      throw new Error(`${errorContext} fetch failed: Unknown error`);
    }
  }

  /**
   * Fetch weather forecast for a specific region
   * 
   * @param adm4Code - Administrative level 4 code (village/sub-district)
   * @returns BMKG weather forecast response
   * @throws Error if API request fails
   */
  async getWeatherForecast(adm4Code: string): Promise<BMKGWeatherAPIResponse> {
    const url = `${this.baseUrl}/prakiraan-cuaca?adm4=${adm4Code}`;
    const data = await this.fetchJSON<BMKGWeatherAPIResponse>(url, 'Weather forecast');
    
    // Validate response structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid BMKG API response structure');
    }

    return data;
  }

  /**
   * Fetch early warning and earthquake data
   * 
   * @returns BMKG early warning response
   * @throws Error if API request fails
   */
  async getEarlyWarning(): Promise<BMKGEarlyWarningResponse> {
    const url = `${this.earlyWarningUrl}/autogempa.json`;
    return await this.fetchJSON<BMKGEarlyWarningResponse>(url, 'Early warning');
  }

  /**
   * Fetch maritime weather data
   * 
   * @returns BMKG maritime weather response
   * @throws Error if API request fails
   */
  async getMaritimeWeather(): Promise<BMKGMaritimeResponse> {
    const url = `${this.maritimeUrl}/perairan`;
    return await this.fetchJSON<BMKGMaritimeResponse>(url, 'Maritime weather');
  }

  /**
   * Test API connectivity
   * Useful for health checks and debugging
   * 
   * @returns true if API is reachable, false otherwise
   */
  async testConnection(): Promise<boolean> {
    try {
      // Example Jakarta Pusat (Central Jakarta) code for testing
      // Note: Replace with actual valid code when available
      const EXAMPLE_ADM4_CODE = '31.71.05.1001';
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
