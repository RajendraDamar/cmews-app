// Location Service
// Handles device location access and wilayah code mapping for Indonesian cities

import * as Location from 'expo-location';
import { WILAYAH_CODES, CITY_COORDINATES } from '../data/wilayah-mapping';

export class LocationService {
  /**
   * Request location permissions and get current device location
   * @returns Current latitude and longitude
   * @throws Error if location permission is denied
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }

  /**
   * Get wilayah code from city name
   * @param cityName - Name of the Indonesian city
   * @returns Wilayah code or default Jakarta code if city not found
   */
  getWilayahCodeFromName(cityName: string): string {
    return WILAYAH_CODES[cityName] || '3171031001'; // Default Jakarta Pusat
  }

  /**
   * Find nearest wilayah code based on geographic coordinates
   * Uses Haversine formula for distance calculation
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns Nearest city's wilayah code
   */
  async getNearestWilayahCode(lat: number, lon: number): Promise<string> {
    // Simple distance-based matching to major cities
    let nearestCity = CITY_COORDINATES[0];
    let minDistance = this.calculateDistance(
      lat,
      lon,
      CITY_COORDINATES[0].lat,
      CITY_COORDINATES[0].lon
    );

    for (const city of CITY_COORDINATES.slice(1)) {
      const distance = this.calculateDistance(lat, lon, city.lat, city.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }

    return nearestCity.code;
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param lat1 - First point latitude
   * @param lon1 - First point longitude
   * @param lat2 - Second point latitude
   * @param lon2 - Second point longitude
   * @returns Distance in kilometers
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}

// Export singleton instance
export const locationService = new LocationService();
