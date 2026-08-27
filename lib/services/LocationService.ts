// Location Service
// Handles device location access, nearest wilayah matching, and dynamic mock data injection for D.I. Yogyakarta & Indonesia

import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { WILAYAH_CODES, CITY_COORDINATES } from '../data/wilayah-mapping';
import { WeatherReport } from '../types/weather-report';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export class LocationService {
  // Default coordinates: D.I. Yogyakarta (Tugu / Malioboro Center)
  private readonly DEFAULT_COORDS: LocationCoords = {
    latitude: -7.7956,
    longitude: 110.3695,
  };

  /**
   * Get default fallback coordinates (D.I. Yogyakarta)
   */
  getDefaultLocation(): LocationCoords {
    return { ...this.DEFAULT_COORDS };
  }

  /**
   * Request location permissions and get current device location
   * Works across Web and Mobile Native with fast last-known fallback and timeout safety
   * @returns Current latitude and longitude
   */
  async getCurrentLocation(): Promise<LocationCoords> {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 60000,
          });
        });
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (webError) {
        console.warn('Web Geolocation failed or denied, using default DIY coordinates:', webError);
        return this.getDefaultLocation();
      }
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted, using default DIY coordinates.');
        return this.getDefaultLocation();
      }

      // Check last known location first for instant response
      const lastKnown = await Location.getLastKnownPositionAsync().catch(() => null);
      if (lastKnown?.coords) {
        // Trigger fresh position in background without blocking
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }).catch(() => null);

        return {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        };
      }

      // If no last known, get fresh position with a 5-second timeout safeguard
      const positionPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
      const result: any = await Promise.race([positionPromise, timeoutPromise]);

      if (result?.coords) {
        return {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        };
      }

      return this.getDefaultLocation();
    } catch (error) {
      console.warn('Failed to get device location, falling back to DIY coordinates:', error);
      return this.getDefaultLocation();
    }
  }

  /**
   * Get wilayah code from city name
   * @param cityName - Name of the Indonesian city
   * @returns Wilayah code or default Yogyakarta code if city not found
   */
  getWilayahCodeFromName(cityName: string): string {
    return WILAYAH_CODES[cityName] || '34.71.01.1001'; // Default Kota Yogyakarta
  }

  /**
   * Find nearest wilayah code based on geographic coordinates
   * Uses Haversine formula for distance calculation
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns Nearest city's wilayah code
   */
  async getNearestWilayahCode(lat: number, lon: number): Promise<string> {
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
   * Generate a dynamic mock weather report at arbitrary GPS coordinates (e.g. user location)
   */
  createMockReportAtLocation(
    coords: LocationCoords,
    options?: Partial<WeatherReport>
  ): WeatherReport {
    const weatherConditions = ['Cerah', 'Cerah Berawan', 'Berawan', 'Hujan Ringan', 'Hujan Sedang', 'Hujan Lebat'];
    const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const windDirections = ['Selatan', 'Barat Daya', 'Tenggara', 'Timur', 'Barat Laut'];

    const weather = options?.weather || weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const severity = options?.severity || (weather.includes('Lebat') ? 'high' : weather.includes('Sedang') ? 'medium' : 'low');
    const temperature = options?.temperature ?? Math.floor(Math.random() * 8) + 25;
    const humidity = options?.humidity ?? Math.floor(Math.random() * 30) + 65;
    const windSpeed = options?.windSpeed ?? Math.floor(Math.random() * 25) + 10;

    return {
      id: options?.id || `user-loc-${Date.now()}`,
      location: options?.location || `Lokasi Anda (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`,
      lat: coords.latitude,
      lon: coords.longitude,
      weather,
      severity,
      temperature,
      humidity,
      windSpeed,
      windDirection: options?.windDirection || windDirections[Math.floor(Math.random() * windDirections.length)],
      notes: options?.notes || `Laporan cuaca real-time di sekitar koordinat perangkat Anda. Kondisi ${weather.toLowerCase()} terpantau saat ini.`,
      user: options?.user || {
        name: 'Anda (GPS)',
        initials: 'GPS',
      },
      timestamp: new Date().toISOString(),
    };
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
