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
   * Fetch weather forecast for a specific region
   * 
   * @param adm4Code - Administrative level 4 code (village/sub-district)
   * @returns BMKG weather forecast response
   * @throws Error if API request fails
   */
  async getWeatherForecast(adm4Code: string): Promise<BMKGWeatherAPIResponse> {
    try {
      const url = `${this.baseUrl}/prakiraan-cuaca?adm4=${adm4Code}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `BMKG API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || !data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid BMKG API response structure');
      }

      return data as BMKGWeatherAPIResponse;
    } catch (error) {
      console.error('Failed to fetch weather forecast from BMKG:', error);
      
      if (error instanceof Error) {
        throw new Error(`Weather forecast fetch failed: ${error.message}`);
      }
      
      throw new Error('Weather forecast fetch failed: Unknown error');
    }
  }

  /**
   * Fetch early warning and earthquake data
   * 
   * @returns BMKG early warning response
   * @throws Error if API request fails
   */
  async getEarlyWarning(): Promise<BMKGEarlyWarningResponse> {
    try {
      const url = `${this.earlyWarningUrl}/autogempa.json`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Early warning API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data as BMKGEarlyWarningResponse;
    } catch (error) {
      console.error('Failed to fetch early warning from BMKG:', error);
      
      if (error instanceof Error) {
        throw new Error(`Early warning fetch failed: ${error.message}`);
      }
      
      throw new Error('Early warning fetch failed: Unknown error');
    }
  }

  /**
   * Fetch maritime weather data
   * 
   * @returns BMKG maritime weather response
   * @throws Error if API request fails
   */
  async getMaritimeWeather(): Promise<BMKGMaritimeResponse> {
    try {
      const url = `${this.maritimeUrl}/perairan`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Maritime API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data as BMKGMaritimeResponse;
    } catch (error) {
      console.error('Failed to fetch maritime weather from BMKG:', error);
      
      if (error instanceof Error) {
        throw new Error(`Maritime weather fetch failed: ${error.message}`);
      }
      
      throw new Error('Maritime weather fetch failed: Unknown error');
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
      // Try to fetch with a common adm4 code (Jakarta Pusat - Menteng)
      const testCode = '31.71.05.1001'; // Example code
      await this.getWeatherForecast(testCode);
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
