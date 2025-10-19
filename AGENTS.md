# Copilot Coding Instructions (Real Backend Integration)

These instructions guide all automated changes for the **cmews-app** repository during **backend integration phase**.

## 1. Current Project Status
- Expo SDK 54 with React Native 0.81.4 / React 19 / TypeScript
- Expo Router file-based navigation with typed routes
- NativeWind 4 + Tailwind with shadcn/ui design system
- React Native Reusables (`@rn-primitives/*`) for UI primitives
- **Charts**: Dual implementation (React Native Chart Kit + Skia with SmartChartWrapper)
- **Backend**: Currently using mock services - needs real BMKG API integration
- **Theme**: Robust light/dark theme system with proper contrast
- **State**: Zustand store for weather data management
- **Maps**: MapLibre for native (iOS/Android) and React Map GL for web

### Technical Stack
```json
{
  "charts": ["react-native-chart-kit", "@shopify/react-native-skia"],
  "backend": ["firebase", "real BMKG APIs"],
  "maps": ["@maplibre/maplibre-react-native", "react-map-gl"],
  "animations": ["React Native Animated API", "react-native-reanimated"],
  "storage": ["@react-native-async-storage/async-storage", "expo-file-system"]
}
```

## 2. Real BMKG API Implementation (Replace Mock Services)

### Current Mock Issues to Fix
- Mock forecast data shows incorrect number of days (should be 3 days exactly)
- Mock hourly data doesn't follow 3-hour intervals (should be 8 forecasts per day)
- Mock timestamps don't match BMKG datetime format
- Mock data structure differs from actual BMKG API response format

### Real BMKG API Structure (Based on Official Documentation)

#### A. Weather Forecast API
```typescript
// lib/services/BMKGService.ts
export interface BMKGWeatherResponse {
  data: Array<{
    utc_datetime: string;        // "2025-10-19 12:00:00" 
    local_datetime: string;      // "2025-10-19 19:00:00"
    t: number;                   // Temperature °C
    hu: number;                  // Humidity %
    weather_desc: string;        // "Berawan Tebal" (Indonesian)
    weather_desc_en: string;     // "Overcast" (English)
    ws: number;                  // Wind speed km/h
    wd: string;                  // Wind direction "Timur Laut"
    tcc: number;                 // Total cloud coverage %
    vs_text: string;             // Visibility "10"
    analysis_date: string;       // "2025-10-19 12:00:00"
    image: string;               // Weather icon filename
  }>;
  lokasi: {
    adm1: string;                // Province
    adm2: string;                // Regency/City  
    adm3: string;                // District
    adm4: string;                // Village/Sub-district
    koord: string;               // "lat,lon"
  };
}

export class BMKGService {
  private baseUrl = 'https://api.bmkg.go.id/publik';
  
  async getWeatherForecast(wilayahCode: string): Promise<BMKGWeatherResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/prakiraan-cuaca?adm4=${wilayahCode}`);
      if (!response.ok) {
        throw new Error(`BMKG API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('BMKG weather fetch failed:', error);
      throw error;
    }
  }

  async getEarlyWarning(): Promise<any> {
    try {
      const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
      if (!response.ok) {
        throw new Error(`BMKG early warning error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('BMKG early warning fetch failed:', error);
      throw error;
    }
  }

  async getMaritimeWeather(): Promise<any> {
    try {
      const response = await fetch('https://peta-maritim.bmkg.go.id/public_api/perairan');
      if (!response.ok) {
        throw new Error(`BMKG maritime error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('BMKG maritime fetch failed:', error);
      throw error;
    }
  }
}
```

#### B. Data Processing (Match Real API Format)
```typescript
// lib/utils/bmkg-processor.ts
export const processBMKGForecast = (rawData: BMKGWeatherResponse) => {
  // BMKG provides 3 days, 8 forecasts per day (3-hour intervals)
  const processed = rawData.data.map(item => ({
    datetime: item.local_datetime,
    timestamp: new Date(item.local_datetime).getTime(),
    temperature: item.t,
    humidity: item.hu,
    weatherDesc: item.weather_desc,
    weatherDescEn: item.weather_desc_en,
    windSpeed: item.ws,
    windDirection: item.wd,
    cloudCover: item.tcc,
    visibility: item.vs_text,
    weatherIcon: item.image
  }));

  // Group by days (8 forecasts per day for 3 days)
  const dailyGroups = [];
  for (let i = 0; i < processed.length; i += 8) {
    dailyGroups.push(processed.slice(i, i + 8));
  }

  return {
    location: rawData.lokasi,
    dailyForecasts: dailyGroups.slice(0, 3), // Ensure exactly 3 days
    lastUpdated: processed[0]?.datetime
  };
};
```

## 3. Chart Data Integration (Fix Mock Data Issues)

### Temperature Chart Data (Real BMKG Format)
```typescript
// components/charts/ChartKitTemperatureChart.tsx
export const ChartKitTemperatureChart = ({ wilayahCode }: { wilayahCode: string }) => {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const bmkgService = new BMKGService();
        const weatherData = await bmkgService.getWeatherForecast(wilayahCode);
        const processed = processBMKGForecast(weatherData);
        
        // Take first 24 hours (8 forecasts) for temperature chart
        const next24Hours = processed.dailyForecasts[0] || [];
        
        const chartData = {
          labels: next24Hours.map(item => 
            new Date(item.datetime).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          ),
          datasets: [{
            data: next24Hours.map(item => item.temperature),
            color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`
          }]
        };
        
        setChartData(chartData);
      } catch (error) {
        console.error('Failed to load real weather data:', error);
        // Fallback to error state or cached data
      }
    };
    
    loadRealData();
  }, [wilayahCode]);

  if (!chartData) return <LoadingChartSkeleton />;
  
  return (
    <LineChart
      data={chartData}
      width={screenWidth - 32}
      height={200}
      chartConfig={getChartConfig()}
      bezier
    />
  );
};
```

## 4. Backend Service Architecture

### Replace Mock Services with Real Implementation
```typescript
// lib/services/WeatherService.ts
import { BMKGService } from './BMKGService';
import { CacheService } from './CacheService';
import { processBMKGForecast } from '../utils/bmkg-processor';

export class WeatherService {
  private bmkgService = new BMKGService();
  private cacheService = new CacheService();

  async getForecastData(wilayahCode: string) {
    const cacheKey = `weather-${wilayahCode}`;
    
    // Try cache first (30-minute TTL for weather data)
    let cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Fetch from real BMKG API
      const rawData = await this.bmkgService.getWeatherForecast(wilayahCode);
      const processed = processBMKGForecast(rawData);
      
      // Cache for 30 minutes (BMKG updates twice daily)
      await this.cacheService.set(cacheKey, processed, 1800000);
      
      return processed;
    } catch (error) {
      console.error('Weather service error:', error);
      throw error;
    }
  }

  async getEarlyWarnings() {
    const cacheKey = 'early-warnings';
    
    let cachedWarnings = await this.cacheService.get(cacheKey);
    if (cachedWarnings) {
      return cachedWarnings;
    }

    try {
      const warnings = await this.bmkgService.getEarlyWarning();
      await this.cacheService.set(cacheKey, warnings, 600000); // 10-minute cache
      return warnings;
    } catch (error) {
      console.error('Early warning service error:', error);
      return [];
    }
  }

  async getMaritimeData() {
    const cacheKey = 'maritime-weather';
    
    let cachedMaritime = await this.cacheService.get(cacheKey);
    if (cachedMaritime) {
      return cachedMaritime;
    }

    try {
      const maritime = await this.bmkgService.getMaritimeWeather();
      await this.cacheService.set(cacheKey, maritime, 1800000); // 30-minute cache
      return maritime;
    } catch (error) {
      console.error('Maritime service error:', error);
      return [];
    }
  }
}
```

## 5. Updated Store Implementation (Replace Mock Store)

```typescript
// store/weatherStore.ts
import { create } from 'zustand';
import { WeatherService } from '../lib/services/WeatherService';

interface WeatherStore {
  currentWeather: any;
  forecast: any[];
  earlyWarnings: any[];
  maritimeWeather: any[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  
  fetchWeatherData: (wilayahCode: string) => Promise<void>;
  fetchEarlyWarnings: () => Promise<void>;
  fetchMaritimeData: () => Promise<void>;
  refreshAllData: (wilayahCode: string) => Promise<void>;
  clearError: () => void;
}

const weatherService = new WeatherService();

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  forecast: [],
  earlyWarnings: [],
  maritimeWeather: [],
  loading: false,
  error: null,
  lastUpdated: null,

  fetchWeatherData: async (wilayahCode: string) => {
    set({ loading: true, error: null });
    
    try {
      const weatherData = await weatherService.getForecastData(wilayahCode);
      
      set({
        currentWeather: weatherData.dailyForecasts[0]?.[0] || null,
        forecast: weatherData.dailyForecasts,
        lastUpdated: weatherData.lastUpdated,
        loading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Weather fetch failed',
        loading: false 
      });
    }
  },

  fetchEarlyWarnings: async () => {
    try {
      const warnings = await weatherService.getEarlyWarnings();
      set({ earlyWarnings: warnings });
    } catch (error) {
      console.warn('Early warnings fetch failed:', error);
    }
  },

  fetchMaritimeData: async () => {
    try {
      const maritime = await weatherService.getMaritimeData();
      set({ maritimeWeather: maritime });
    } catch (error) {
      console.warn('Maritime data fetch failed:', error);
    }
  },

  refreshAllData: async (wilayahCode: string) => {
    const { fetchWeatherData, fetchEarlyWarnings, fetchMaritimeData } = get();
    
    await Promise.all([
      fetchWeatherData(wilayahCode),
      fetchEarlyWarnings(),
      fetchMaritimeData()
    ]);
  },

  clearError: () => set({ error: null })
}));
```

## 6. Implementation Priorities

### Phase 1: Replace Mock Services
- **Priority 1**: Replace `lib/services/MockBMKGService.ts` with real `BMKGService.ts`
- **Priority 2**: Update `store/store.ts` to use real weather service
- **Priority 3**: Fix mock data in `lib/data/` to match real API format

### Phase 2: Data Processing
- Implement `processBMKGForecast()` to handle real API responses
- Fix chart components to consume properly formatted data
- Ensure exactly 3 days of forecast data (24 forecasts total, 8 per day)

### Phase 3: Error Handling & Offline Support
- Add network error handling for BMKG API failures
- Implement offline data caching with proper TTL
- Add retry logic for failed API requests

## 7. BMKG API Endpoints (Official)

### Primary Weather API
```
https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={wilayah_code}
```
- **Format**: JSON
- **Data**: 3 days forecast, 8 forecasts per day (3-hour intervals)
- **Update**: Twice daily
- **Rate limit**: 60 requests per minute per IP

### Early Warning API
```
https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json
```
- **Format**: JSON
- **Data**: Latest earthquake and weather warnings
- **Update**: Real-time

### Maritime Weather API  
```
https://peta-maritim.bmkg.go.id/public_api/perairan
```
- **Format**: JSON
- **Data**: Maritime weather conditions for Indonesian waters
- **Update**: Every 6 hours

## 8. Data Validation Rules

### Weather Forecast Data
- **Days**: Exactly 3 days of forecast data
- **Intervals**: 8 forecasts per day (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00)
- **Temperature range**: 15°C to 40°C (Indonesian climate)
- **Humidity range**: 30% to 100%
- **Wind speed**: 0 to 200 km/h

### Chart Data Processing
```typescript
// Ensure data consistency for charts
const validateChartData = (data: any[]) => {
  return data
    .filter(item => item.temperature >= 15 && item.temperature <= 40)
    .filter(item => item.humidity >= 30 && item.humidity <= 100)
    .slice(0, 24); // Maximum 24 data points for charts
};
```

## 9. Error Handling Strategy

### Network Error Recovery
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
        delayMs *= 2; // Exponential backoff
      }
    }
    throw new Error('Max retries exceeded');
  }

  static isBMKGError(error: any): boolean {
    return error.message?.includes('BMKG') || 
           error.status >= 400 && error.status < 500;
  }
}
```

## 10. Offline Data Strategy

### Cache Implementation
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

  async set(key: string, data: any, ttl = 1800000) { // 30 minutes default
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
      
      // Check TTL
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

## 11. Implementation Guidelines

### Code Quality Standards
- **TypeScript**: Strict mode compilation required
- **ESLint**: Must pass with max 25 warnings
- **Prettier**: Code formatting enforced
- **Build**: Production build must succeed
- **Cross-platform**: All features must work on iOS, Android, and web

### API Integration Rules
- Always implement caching for BMKG API calls
- Handle network failures gracefully with user-friendly messages
- Implement retry logic with exponential backoff
- Validate data structure before processing
- Log API errors for debugging

### Data Consistency
- Follow real BMKG API response structure exactly
- Validate forecast data shows exactly 3 days
- Ensure hourly data follows 3-hour intervals
- Temperature and humidity values must be within Indonesian climate ranges

### Chart Implementation
- Use React Native Chart Kit for cross-platform compatibility
- Implement Skia charts with SmartChartWrapper for enhanced performance
- Always validate data before passing to charts
- Handle empty or invalid data gracefully

## 12. Excluded Features
- **Earthquake API**: Not implemented (as requested)
- **International weather**: Indonesia-focused only
- **Port weather**: Maritime covers open waters only
- **Historical data**: Current and forecast only

## 13. Testing Requirements
- All BMKG API integrations must be tested with real endpoints
- Charts must render with real data (not mock data)
- Offline functionality must be verified
- Cross-platform compatibility required
- Error scenarios must be handled gracefully

---

These instructions ensure production-ready backend integration with real BMKG APIs while maintaining the excellent UI/UX foundation and fixing mock data inconsistencies.