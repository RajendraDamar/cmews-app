# Copilot Coding Instructions (Frontend-First Development)

These instructions guide all automated changes for the **cmews-app** repository during **frontend development phase**.

## 1. Project Snapshot
- Expo SDK 54 (managed workflow) with enhanced autolinking
- React Native 0.81 / React 19 / TypeScript
- Expo Router file-based navigation
- NativeWind 4 + Tailwind utility classes
- React Native Reusables (`@rn-primitives/*`) for UI primitives
- Lucide React Native for iconography
- React Native Reanimated (web support available but performance-limited)
- **Cross-platform libraries**: React Native ECharts, Lottie + Skia animations, MapLibre (platform-specific)
- **Mock Data**: Local mock data for BMKG APIs (weather, early warning, maritime)
- **Future Integration**: Firebase Auth + FCM (not implemented yet)

### Supported Platforms
- **Native**: iOS, Android (Expo Go or dev builds)
- **Web**: React Native Web via Expo CLI
- **PWA**: Progressive Web App capabilities can be retrofitted post-development
- When platform-specific behavior is required, gate with `Platform.OS` or Expo platform checks. Prefer shared code.

## 2. General Principles
1. **Keep it simple**: Prefer minimal, readable solutions over abstractions or patterns the current codebase does not use.
2. **Respect existing conventions**: Follow established folder layout (`app`, `components`, `lib`, `store`, `markdown`, etc.) and naming.
3. **Stay cross-platform**: New logic must run on native *and* web unless explicitly scoped.
4. **Frontend-first approach**: Focus on UI/UX implementation using mock data that matches BMKG API schemas.
5. **Lean on Expo SDK 54**: Use enhanced built-in features before adding external dependencies.
6. **Mock-driven development**: Create realistic mock data that can be easily replaced with real API calls later.
7. **No architectural rewrites**: Work within Expo Router and current design system. Only refactor when necessary for the change.
8. **Documentation guidelines**: only README.md and CHANGES.md are allowed for documentation (markdown file). if exist other docs, combine them into README.md or delete them if outdated.

## 3. UI Implementation Guidelines
- Use components from `components/ui` (shadcn-style) and `@rn-primitives/*` for dialogs, sheets, tabs, etc.
- **Icons**: Use Lucide React Native for consistent iconography across platforms.
- Styling: prefer Tailwind classes via `className` with `cn()` helper. Avoid inline styles except for dynamic values.
- **Animations (Performance-Optimized Hierarchy)**: 
  - **React Native Animated API**: First choice for cross-platform animations (60fps stable performance)
  - **Lottie**: Designer-created animations with excellent cross-platform support
  - **React Native Skia**: High-performance custom graphics and complex animations
  - **React Native Reanimated**: Use cautiously - web performance issues reported (200ms freezes, frame drops). Prefer for native-only complex animations with `Platform.OS !== 'web'` guards
- Skeleton/loading states should use the existing `Skeleton` component (built on `Animated`).
- Keep layouts responsive with `useBreakpoint`, `Platform.OS`, and flexbox. Do not introduce layout frameworks.

## 4. Data & State Management
- Global state: use Zustand store in `store/store.ts` if shared state is needed.
- Local state: React hooks. Avoid adding Redux/MobX/etc.
- **Mock Data**: All data comes from `lib/data/` directory with realistic BMKG API response formats.
- **Future-Ready Structure**: Design data layer to easily switch from mock to real API calls later.
- Mock data lives under `lib/data`. **Must** match BMKG API schemas exactly for seamless transition.

## 5. Mock Data Strategy (Temporary - Frontend Phase)
- **Mock BMKG APIs**: Create realistic mock data that matches actual BMKG API response structures.
- **Data Sources** (to be implemented later):
  - Weather Forecast: `prakiraan-cuaca` (3-day forecasts with 8 times per day)
  - Early Warning: `peringatan-dini` (weather warnings and alerts)
  - Maritime Weather: `perairan` (marine weather with wave heights and wind data)
- **Mock implementation pattern**:
  ```javascript
  // lib/data/bmkg-mock.ts - Temporary mock data
  export const mockWeatherForecast = {
    data: [
      {
        utc_datetime: "2025-10-12 10:00:00",
        local_datetime: "2025-10-12 17:00:00",
        t: 28,                    // Temperature °C
        hu: 75,                   // Humidity %
        weather_desc: "Hujan Ringan",
        weather_desc_en: "Light Rain",
        ws: 15,                   // Wind speed km/h
        wd: "Timur",             // Wind direction
        tcc: 80,                 // Cloud coverage %
        vs_text: "10"            // Visibility km
      }
      // ... more forecast periods
    ]
  };

  export const mockEarlyWarning = {
    peringatan: [
      {
        wilayah: "DI Yogyakarta",
        level: "Waspada",
        cuaca: "Hujan Lebat",
        warning_desc: "Potensi hujan lebat dengan intensitas 20-50 mm dalam 24 jam",
        valid_from: "2025-10-12 12:00:00",
        valid_to: "2025-10-13 12:00:00"
      }
    ]
  };

  export const mockMaritimeWeather = {
    perairan: [
      {
        code: "ID001",
        wilayah: "Laut Jawa Barat",
        weather: "Cerah Berawan",
        wave_cat: "Sedang",
        wave_desc: "1.0 - 2.0 m",
        wind_speed_min: 10,
        wind_speed_max: 20,
        warning_desc: null
      }
    ]
  };

  // Service layer that will be easily replaceable
  class MockBMKGService {
    async getWeatherForecast(wilayahCode) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockWeatherForecast;
    }

    async getEarlyWarning(wilayahCode) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockEarlyWarning;
    }

    async getMaritimeWeather() {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockMaritimeWeather;
    }
  }
  ```

## 6. Storage Strategy (Frontend Phase)
- **Local Storage**: Use Enhanced Expo File System (SDK 54) for mock data persistence and user preferences.
- **No remote storage**: All data stored locally during frontend development phase.
- **Future-ready structure**: Design storage layer to accommodate real API caching later.
- **Implementation pattern**:
  ```javascript
  import { File, Directory, Paths } from 'expo-file-system';
  
  class LocalStorageManager {
    constructor() {
      this.dataDir = new Directory(Paths.documentDirectory, 'app_data');
      this.preferencesFile = new File(this.dataDir, 'user_preferences.json');
    }

    async init() {
      await this.dataDir.create();
    }

    async saveUserPreferences(preferences) {
      await this.preferencesFile.writeAsString(JSON.stringify({
        favoriteLocations: preferences.locations,
        notificationSettings: preferences.notifications,
        theme: preferences.theme,
        language: preferences.language,
        savedAt: new Date().toISOString()
      }));
    }

    async getUserPreferences() {
      try {
        if (await this.preferencesFile.exists()) {
          return JSON.parse(await this.preferencesFile.readAsString());
        }
      } catch (error) {
        console.warn('Preferences read failed:', error);
      }
      return null;
    }
  }
  ```

## 7. Platform Compatibility
- Always test mental model for **native + web + PWA scenarios** using mock data.
- If a feature only works on native, guard it with `Platform.OS !== 'web'` and supply a safe fallback.
- **Enhanced autolinking (SDK 54)**: Trust the enhanced dependency management system.
- **Network simulation**: Create loading states and error handling for future API integration.
- Do not introduce native-only modules that break Expo managed workflow without discussion.

## 8. Charts & Visualization
- **Primary**: Use React Native ECharts for all chart implementations (true cross-platform compatibility).
- **Weather data visualization**: Create charts using mock BMKG data that matches real API response structure.
- **Implementation pattern**:
  ```javascript
  import { BarChart, LineChart } from 'react-native-echarts-wrapper';
  import { mockWeatherForecast } from '../lib/data/bmkg-mock';
  
  const WeatherChart = () => {
    const chartData = mockWeatherForecast.data.map(item => ({
      name: item.local_datetime.split(' ')[1].substring(0,5), // HH:MM
      temperature: item.t,
      humidity: item.hu
    }));
    
    return (
      <LineChart
        data={chartData}
        xAxis={{ type: 'category', data: chartData.map(d => d.name) }}
        series={[
          { 
            name: 'Temperature (°C)', 
            data: chartData.map(d => d.temperature),
            itemStyle: { color: '#ff6b35' }
          },
          { 
            name: 'Humidity (%)', 
            data: chartData.map(d => d.humidity),
            itemStyle: { color: '#4ecdc4' }
          }
        ]}
        grid={{ top: 20, bottom: 60, left: 50, right: 20 }}
      />
    );
  };
  ```
- Focus on responsive chart layouts and smooth animations for loading states.

## 9. Maps Implementation (Mock Data Phase)
- **Platform-specific MapLibre approach**: Use mock GeoJSON data that matches BMKG maritime API structure.
- **Mock implementation pattern**:
  ```javascript
  // maps/WeatherMapView.native.tsx - MapLibre React Native
  import { MapView, ShapeSource, FillLayer } from '@maplibre/maplibre-react-native';
  import { mockMaritimeWeather } from '../lib/data/bmkg-mock';
  
  export const WeatherMapView = () => {
    const mockGeoJSON = createMockMaritimeGeoJSON(mockMaritimeWeather);
    
    return (
      <MapView 
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v11"
      >
        {/* Mock maritime weather zones */}
        <ShapeSource id="maritime-zones" shape={mockGeoJSON}>
          <FillLayer
            id="maritime-fill"
            style={{
              fillColor: ['get', 'waveColor'], // Pre-computed from mock data
              fillOpacity: 0.6
            }}
          />
        </ShapeSource>
      </MapView>
    );
  };
  
  // maps/WeatherMapView.web.tsx - MapLibre GL JS
  import maplibregl from 'maplibre-gl';
  import { mockMaritimeWeather } from '../lib/data/bmkg-mock';
  
  export const WeatherMapView = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    
    useEffect(() => {
      if (!map.current) {
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://demotiles.maplibre.org/style.json',
          center: [118.0, -2.0], // Indonesia center
          zoom: 5
        });
        
        map.current.on('load', () => {
          addMockWeatherLayers(mockMaritimeWeather);
        });
      }
    }, []);
    
    return <div ref={mapContainer} style={{ height: '400px' }} />;
  };
  
  // maps/mock-utils.ts - Mock data utilities
  export const createMockMaritimeGeoJSON = (maritimeData) => {
    return {
      type: 'FeatureCollection',
      features: maritimeData.perairan.map(zone => ({
        type: 'Feature',
        properties: {
          code: zone.code,
          wilayah: zone.wilayah,
          waveColor: getWaveHeightColor(zone.wave_cat),
          waveHeight: zone.wave_desc,
          warning: zone.warning_desc
        },
        geometry: {
          type: 'Polygon',
          coordinates: generateMockPolygon(zone.code) // Mock polygon coordinates
        }
      }))
    };
  };
  ```
- **Focus**: Perfect the UI/UX, animations, and layout responsiveness using mock data.
- **Future-ready**: Structure components to easily accept real API data later.

## 10. Files & Modules Organization
Create the following file structure for frontend-first development:

### Mock Data (Temporary)
- `lib/data/bmkg-mock.ts` - Realistic mock data matching BMKG API schemas
- `lib/data/weather-mock.ts` - Weather forecast mock data (3 days, 8 times per day)
- `lib/data/warning-mock.ts` - Early warning system mock data
- `lib/data/maritime-mock.ts` - Maritime weather mock data (waters only, no ports)

### Frontend Services (Mock Implementation)
- `lib/services/MockBMKGService.ts` - Mock service that simulates API calls with delays
- `lib/services/MockStorageService.ts` - Local storage simulation using Enhanced File System
- `lib/services/types.ts` - TypeScript interfaces for all data structures (future-ready)

### UI Components
- `components/weather/WeatherCard.tsx` - Weather forecast display component
- `components/weather/WeatherChart.tsx` - Temperature/humidity charts using ECharts
- `components/weather/WeatherList.tsx` - Multi-day weather forecast list
- `components/warning/WarningAlert.tsx` - Weather warning display component
- `components/warning/WarningBanner.tsx` - Alert banner for active warnings
- `components/maritime/MaritimeCard.tsx` - Maritime weather display
- `components/maritime/WaveIndicator.tsx` - Wave height visualization component

### Map Components (Mock-Ready)
- `components/maps/WeatherMapView.native.tsx` - MapLibre React Native with mock data
- `components/maps/WeatherMapView.web.tsx` - MapLibre GL JS with mock data
- `components/maps/index.ts` - Platform-aware exports
- `components/maps/mock-utils.ts` - Mock GeoJSON generation utilities
- `components/maps/styles.ts` - Map styling for weather and maritime data

### Core App Structure
- Focus on routing, navigation, and screen layouts
- Perfect responsive design and cross-platform compatibility
- Implement loading states and error handling UI
- Create settings and preferences screens (local storage only)

## 11. Animation Strategy
- **Performance Priority Order**:
  1. **React Native Animated API** - Cross-platform loading animations, transitions
  2. **Lottie** - Weather icons and animated illustrations
  3. **React Native Skia** - Custom weather graphics and map animations
  4. **React Native Reanimated** - Native-only complex animations with platform guards
- **Focus on**: Smooth transitions, weather icon animations, chart loading states, map layer transitions.

## 12. Testing & Validation (Frontend Phase)
- Run `npm run web` for web validation and `npx expo start` for native when feasible.
- **UI Testing**: Test all components with various mock data scenarios.
- **Responsiveness Testing**: Verify layouts work on different screen sizes.
- **Animation Testing**: Ensure smooth 60fps performance on both platforms.
- **Mock Data Testing**: Test loading states, error states, and empty data scenarios.
- **Cross-Platform Testing**: Verify identical behavior on native and web.
- Lint/format with `npm run lint` or `npm run format` before finalizing changes.

## 13. Performance & Accessibility
- Favor lazy loading and Suspense-friendly patterns already used by Expo Router.
- Use semantic text components (`components/ui/text`) for typography.
- Keep accessibility labels/descriptions consistent with existing components.
- **Animation Performance**: Monitor for main-thread blocks and frame drops, especially on web platform.
- **Mock Performance**: Simulate realistic loading times for future API integration.
- **Memory Management**: Implement proper cleanup for mock data and map resources.

## 14. Frontend Success Criteria
Every component must:
1. **Work on native iOS/Android** through Expo Go or development builds
2. **Work on web** through React Native Web with full functionality and good performance  
3. **Display mock data beautifully** with proper Indonesian weather information formatting
4. **Handle loading and error states** gracefully with appropriate UI feedback
5. **Be responsive** across different screen sizes and orientations
6. **Maintain 60fps performance** across all platforms
7. **Be ready for API integration** - easy to replace mock services with real APIs
8. **Include proper Indonesian text** with correct weather terminology and formatting

## 15. Mock BMKG Data Requirements
Create realistic mock data for these 3 APIs only:

### A. Weather Forecast Mock Data
Match the structure of: `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={wilayah_code}`
- 3-day forecasts with 8 time periods per day (every 3 hours)
- Include: temperature, humidity, weather description, wind data, cloud coverage
- Multiple Indonesian locations (Jakarta, Yogyakarta, Surabaya, Medan, Makassar)

### B. Early Warning Mock Data  
Weather warning system data with:
- Warning levels (Normal, Waspada, Siaga, Awas)
- Weather phenomena (heavy rain, strong winds, lightning)
- Affected regions and time periods
- Warning descriptions in Indonesian

### C. Maritime Weather Mock Data
Match the structure of: `https://peta-maritim.bmkg.go.id/public_api/perairan`
- Maritime zones around Indonesia
- Wave categories (Tenang, Rendah, Sedang, Tinggi, Sangat Tinggi)
- Wave height ranges, wind speed/direction
- Weather warnings for marine areas
- **Exclude port data** - only open water maritime zones

## 16. Non-Goals / Avoid (Frontend Phase)
- Do **not** implement real API calls - use mock services only.
- Do **not** set up Firebase, authentication, or push notifications yet.
- Do **not** implement earthquake data or port weather data.
- Do **not** create server-side infrastructure or external service integrations.
- Do **not** use Victory Native or other platform-specific solutions.
- Do **not** eject from Expo or add native modules requiring custom builds.
- **Avoid complex state management** - keep it simple with local state and mock data.
- **Focus only on UI/UX** - backend integration comes later.

## 17. Future Backend Integration Readiness
Design all components and services to be easily upgradeable:
- **Service Layer**: Mock services should have identical APIs to future real services
- **Data Types**: Use exact TypeScript interfaces that match BMKG API responses
- **Error Handling**: Implement proper error states that will work with real API errors
- **Loading States**: Create loading UIs that will work with actual network requests
- **Caching Structure**: Design cache interfaces that can be extended to real caching later

## 18. Indonesian Localization Requirements
- **Weather Terms**: Use proper Indonesian weather terminology
- **Location Names**: Use official Indonesian place names and administrative divisions
- **Time Format**: Display times in WIB (Western Indonesia Time)
- **Data Attribution**: Include "Data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)" placeholder
- **Warning Messages**: Use proper Indonesian alert terminology and formatting

---
Following these instructions ensures rapid frontend development with beautiful UI/UX using realistic mock data, while maintaining a clean architecture that will seamlessly transition to real BMKG API integration and Firebase backend services later.