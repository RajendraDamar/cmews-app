# Copilot Coding Instructions

These instructions guide all automated changes for the **cmews-app** repository.

## 1. Project Snapshot
- Expo SDK 54 (managed workflow) with enhanced autolinking
- React Native 0.81 / React 19 / TypeScript
- Expo Router file-based navigation
- NativeWind 4 + Tailwind utility classes
- React Native Reusables (`@rn-primitives/*`) for UI primitives
- Lucide React Native for iconography
- React Native Reanimated (web support available but performance-limited)
- **Cross-platform libraries**: React Native ECharts, Lottie + Skia animations, MapLibre (platform-specific)
- **Storage & Offline**: Enhanced Expo File System (SDK 54) + Firebase integration
- **Data Sources**: BMKG Open Data APIs (client-side calls)
- Firebase Auth + FCM for authentication and push notifications

### Supported Platforms
- **Native**: iOS, Android (Expo Go or dev builds)
- **Web**: React Native Web via Expo CLI
- **PWA**: Progressive Web App capabilities can be retrofitted post-development
- When platform-specific behavior is required, gate with `Platform.OS` or Expo platform checks. Prefer shared code.

## 2. General Principles
1. **Keep it simple**: Prefer minimal, readable solutions over abstractions or patterns the current codebase does not use.
2. **Respect existing conventions**: Follow established folder layout (`app`, `components`, `lib`, `store`, `markdown`, etc.) and naming.
3. **Stay cross-platform**: New logic must run on native *and* web unless explicitly scoped.
4. **Offline-first approach**: Design features to work offline with aggressive caching of BMKG API responses.
5. **Lean on Expo SDK 54**: Use enhanced built-in features (File System, autolinking) before adding external dependencies.
6. **Direct API approach**: Use client-side calls to BMKG APIs with proper rate limiting and offline fallbacks.
7. **No architectural rewrites**: Work within Expo Router and current design system. Only refactor when necessary for the change.

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
- **Local Storage**: Use Enhanced Expo File System (SDK 54) for all local data persistence and API response caching.
- **Offline Queue**: Store failed API calls and sync when network returns (not applicable for read-only BMKG data).
- Mock data lives under `lib/data`. Match BMKG API schemas when creating new mocks.

## 5. BMKG API Integration Strategy
- **Direct client-side calls**: No server proxy required - call BMKG APIs directly from client.
- **Rate limiting**: 60 requests/minute per IP address (very generous for weather apps).
- **Offline-first pattern**: Cache all API responses locally using Enhanced File System.
- **Error handling**: Gracefully fallback to cached data when API/network unavailable.
- **API Endpoints**:
  - Weather Forecast: `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={wilayah_code}`
  - Latest Earthquake: `https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json`
  - Significant Earthquakes: `https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json`
  - Maritime Weather: `https://peta-maritim.bmkg.go.id/public_api/perairan`
  - Port Weather: `https://peta-maritim.bmkg.go.id/public_api/pelabuhan`
- **Implementation pattern**:
  ```javascript
  class BMKGApiService {
    constructor() {
      this.baseUrl = 'https://api.bmkg.go.id/publik';
      this.dataUrl = 'https://data.bmkg.go.id/DataMKG/TEWS';
      this.maritimeUrl = 'https://peta-maritim.bmkg.go.id/public_api';
    }

    async getWeatherForecast(wilayahCode) {
      try {
        const response = await fetch(`${this.baseUrl}/prakiraan-cuaca?adm4=${wilayahCode}`);
        const data = await response.json();
        
        // Cache using Enhanced File System
        await this.cacheWeatherData(wilayahCode, data);
        return data;
      } catch (error) {
        // Offline fallback
        return await this.getCachedWeatherData(wilayahCode);
      }
    }

    async getLatestEarthquake() {
      try {
        const response = await fetch(`${this.dataUrl}/autogempa.json`);
        const data = await response.json();
        
        await this.cacheEarthquakeData('latest', data);
        return data;
      } catch (error) {
        return await this.getCachedEarthquakeData('latest');
      }
    }

    async getMaritimeWeather() {
      try {
        const response = await fetch(`${this.maritimeUrl}/perairan`);
        const data = await response.json();
        
        await this.cacheMaritimeData('waters', data);
        return data;
      } catch (error) {
        return await this.getCachedMaritimeData('waters');
      }
    }
  }
  ```

## 6. Storage & Offline Strategy
- **Enhanced File System (SDK 54)**: Primary storage solution with object-oriented API for BMKG data caching.
- **Implementation pattern**:
  ```javascript
  import { File, Directory, Paths } from 'expo-file-system';
  
  class BMKGCacheManager {
    constructor() {
      this.cacheDir = new Directory(Paths.documentDirectory, 'bmkg_cache');
      this.weatherDir = new Directory(this.cacheDir, 'weather');
      this.earthquakeDir = new Directory(this.cacheDir, 'earthquake');
      this.maritimeDir = new Directory(this.cacheDir, 'maritime');
    }

    async init() {
      await Promise.all([
        this.cacheDir.create(),
        this.weatherDir.create(),
        this.earthquakeDir.create(),
        this.maritimeDir.create()
      ]);
    }

    async cacheWeatherData(wilayahCode, data) {
      const file = new File(this.weatherDir, `${wilayahCode}.json`);
      await file.writeAsString(JSON.stringify({
        data,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
      }));
    }

    async getCachedWeatherData(wilayahCode) {
      try {
        const file = new File(this.weatherDir, `${wilayahCode}.json`);
        if (await file.exists()) {
          const cached = JSON.parse(await file.readAsString());
          
          // Check if data is still valid (6 hours)
          if (new Date(cached.expires_at) > new Date()) {
            return cached.data;
          }
        }
      } catch (error) {
        console.warn('Cache read failed:', error);
      }
      return null;
    }
  }
  ```
- **Firebase Integration**: Use only for auth, FCM, and user preferences - not for BMKG data storage.
- **Cache strategy**: Weather data (6 hours), earthquake data (1 hour), maritime data (12 hours).

## 7. Platform Compatibility
- Always test mental model for **native + web + PWA + offline scenarios**.
- If a feature only works on native, guard it with `Platform.OS !== 'web'` and supply a safe fallback.
- **Enhanced autolinking (SDK 54)**: Reduces manual configuration - trust the improved dependency management.
- **Network detection**: Use `@react-native-netinfo/netinfo` for offline/online state management.
- Do not introduce native-only modules that break Expo managed workflow without discussion.

## 8. Charts & Visualization
- **Primary**: Use React Native Skia for high-performance chart implementations (true cross-platform 60fps rendering).
- **Performance**: Hardware-accelerated GPU rendering with React Native Reanimated for smooth animations.
- **Weather data visualization**: Create charts from BMKG API responses (temperature trends, rainfall, wind patterns).
- **Implementation pattern**:
  ```javascript
  import { SkiaTemperatureChart, SkiaPrecipitationChart, SkiaWindChart, SkiaWaveChart } from '~/components/charts';
  
  // Temperature & Humidity Chart
  const WeatherChart = ({ weatherData }) => {
    const chartData = weatherData.map(item => ({
      time: item.local_datetime,
      temp: item.t,
      humidity: item.hu
    }));
    
    return <SkiaTemperatureChart data={chartData} animated={true} />;
  };
  
  // Precipitation Bar Chart
  const RainfallChart = ({ weatherData }) => {
    const chartData = weatherData.map(item => ({
      time: item.local_datetime,
      precipitation: item.rainfall || 0
    }));
    
    return <SkiaPrecipitationChart data={chartData} />;
  };
  
  // Wind Compass Chart
  const WindChart = ({ windData }) => {
    const chartData = windData.map(item => ({
      direction: item.direction,
      speed: item.speed_kmh,
      directionDegrees: item.degrees
    }));
    
    return <SkiaWindChart data={chartData} />;
  };
  
  // Maritime Wave Chart
  const WaveChart = ({ maritimeData }) => {
    const chartData = maritimeData.map(item => ({
      time: item.time,
      height: item.wave_height_m
    }));
    
    return <SkiaWaveChart data={chartData} />;
  };
  ```
- **Architecture**: Custom Skia-based charts in `components/charts/` with utilities for path generation, scaling, and animations.
- **Dependencies**: Uses d3-scale, d3-shape, d3-interpolate for professional chart calculations.
- **Performance characteristics**:
  - 60fps animations on all platforms
  - <100ms initial render for 200+ data points
  - 50% less memory usage than ECharts
  - ~1.7MB smaller bundle size
  - Hardware-accelerated via GPU
- **Backward compatibility**: Existing components (TemperatureChart, PrecipitationChart, WeatherChart) automatically use Skia implementations.
- **Fallback**: ECharts wrapper code remains for reference but Skia is the primary implementation.
- See `components/charts/README.md` for comprehensive documentation.

## 9. Maps Implementation
- **Platform-specific MapLibre approach**: Use separate implementations for optimal offline support and BMKG maritime data visualization.
- **Implementation pattern**:
  ```javascript
  // maps/WeatherMapView.native.tsx - MapLibre React Native
  import { MapView, ShapeSource, FillLayer, SymbolLayer } from '@maplibre/maplibre-react-native';
  
  export const WeatherMapView = ({ weatherData, earthquakeData, maritimeData }) => {
    return (
      <MapView 
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v11"
      >
        {/* Maritime weather zones */}
        {maritimeData && (
          <ShapeSource id="maritime-zones" shape={maritimeData.geoJson}>
            <FillLayer
              id="maritime-fill"
              style={{
                fillColor: {
                  type: 'categorical',
                  property: 'zone_code',
                  stops: maritimeData.zones.map(zone => [
                    zone.code,
                    getWaveHeightColor(zone.wave_cat)
                  ])
                },
                fillOpacity: 0.6
              }}
            />
          </ShapeSource>
        )}
        
        {/* Earthquake markers */}
        {earthquakeData && (
          <ShapeSource id="earthquakes" shape={createEarthquakeGeoJSON(earthquakeData)}>
            <SymbolLayer
              id="earthquake-symbols"
              style={{
                iconImage: 'earthquake-icon',
                iconSize: ['interpolate', ['linear'], ['get', 'magnitude'], 3, 0.5, 8, 2.0]
              }}
            />
          </ShapeSource>
        )}
        
        {/* Weather station markers */}
        {weatherData && (
          <ShapeSource id="weather-stations" shape={createWeatherGeoJSON(weatherData)}>
            <SymbolLayer
              id="weather-symbols"
              style={{
                iconImage: 'weather-icon',
                iconSize: 1.0
              }}
            />
          </ShapeSource>
        )}
      </MapView>
    );
  };
  
  // maps/WeatherMapView.web.tsx - MapLibre GL JS
  import maplibregl from 'maplibre-gl';
  
  export const WeatherMapView = ({ weatherData, earthquakeData, maritimeData }) => {
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
          addWeatherLayers(weatherData, earthquakeData, maritimeData);
        });
      }
    }, [weatherData, earthquakeData, maritimeData]);
    
    return <div ref={mapContainer} style={{ height: '400px' }} />;
  };
  
  // maps/index.ts - Platform-specific exports
  export { WeatherMapView } from './WeatherMapView';
  ```
- **BMKG Data Integration**:
  - Display weather forecast data as markers/overlays
  - Show earthquake epicenters with magnitude-based sizing
  - Render maritime zones with wave height color coding
  - Add weather warnings as map annotations
- **Offline Strategy**: Download map packs for Indonesian regions, cache BMKG API responses, store GeoJSON data locally.

## 10. Firebase Integration
- **Authentication**: Firebase Auth for user management and preferences storage.
- **Push Notifications**: Firebase Cloud Messaging (FCM) for weather alerts and earthquake notifications.
- **User Data**: Store user preferences, favorite locations, notification settings in Firestore.
- **No BMKG Data Storage**: Do not store BMKG API responses in Firebase - use local Enhanced File System instead.
- **Implementation pattern**:
  ```javascript
  // Firebase setup for user features only
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  // User preferences storage
  async saveUserPreferences(userId, preferences) {
    await setDoc(doc(db, 'users', userId), {
      favoriteLocations: preferences.locations,
      notificationSettings: preferences.notifications,
      updatedAt: serverTimestamp()
    });
  }
  
  // Weather alert notifications
  async sendWeatherAlert(weatherData) {
    if (weatherData.warning_desc) {
      await sendNotification({
        title: 'Peringatan Cuaca',
        body: weatherData.warning_desc,
        data: { type: 'weather_warning', region: weatherData.wilayah }
      });
    }
  }
  ```

## 11. Animation Strategy
- **Performance Priority Order**:
  1. **React Native Skia** - Hardware-accelerated graphics for charts and complex visualizations (60fps guaranteed)
  2. **React Native Reanimated** - Native thread animations for UI components and chart transitions
  3. **React Native Animated API** - Proven cross-platform performance for basic animations
  4. **Lottie** - Designer animations with excellent web support
- **Chart Animations**: Use Skia + Reanimated for smooth 60fps chart rendering and transitions.
- **Weather Animation Use Cases**: Chart entry animations, loading states for API calls, map layer animations.
- **Best Practices**:
  - Use Skia for complex 2D graphics (charts, custom visualizations)
  - Use Reanimated for UI transitions and gestures
  - Batch animation updates for better performance
  - Disable animations for large datasets (>100 points)

## 12. Files & Modules
- New shared components go under `components/` with logical grouping (e.g., `components/weather`, `components/earthquake`).
- **BMKG API services**: Create `lib/bmkg/` for API service classes:
  - `lib/bmkg/WeatherService.ts` - Weather forecast API
  - `lib/bmkg/EarthquakeService.ts` - Earthquake data API
  - `lib/bmkg/MaritimeService.ts` - Maritime weather API
  - `lib/bmkg/CacheManager.ts` - Enhanced File System caching
  - `lib/bmkg/types.ts` - TypeScript interfaces for BMKG data
- **Map components**: Create `components/maps/` with platform-specific implementations:
  - `components/maps/WeatherMapView.native.tsx` - MapLibre React Native with BMKG data
  - `components/maps/WeatherMapView.web.tsx` - MapLibre GL JS with BMKG data
  - `components/maps/index.ts` - Platform-aware exports
  - `components/maps/utils.ts` - GeoJSON creation utilities for BMKG data
  - `components/maps/styles.ts` - Map styling for weather/earthquake/maritime data
- **Offline utilities**: Create `lib/offline/` for cache management and sync logic.
- Update `markdown/` docs when adding noteworthy workflows or fixes.
- Keep ASCII text only.

## 13. Testing & Validation
- Run `npm run web` for web validation and `npx expo start` for native when feasible.
- **Offline Testing**: Test app functionality with network disabled, ensure BMKG data loads from cache.
- **API Rate Limiting**: Test 60 requests/minute limit handling and proper error responses.
- **Map Testing**: Test weather data visualization, earthquake markers, and maritime zone rendering.
- **Performance Testing**: Monitor animation performance on web, especially when using Reanimated.
- Test Firebase Auth flow and FCM notifications on both platforms.
- **Data Freshness**: Test cache expiration and automatic refresh of BMKG data.
- Lint/format with `npm run lint` or `npm run format` before finalizing large changes.
- Avoid adding automated test frameworks unless explicitly requested.

## 14. Performance & Accessibility
- Favor lazy loading and Suspense-friendly patterns already used by Expo Router.
- Use semantic text components (`components/ui/text`) for typography.
- Keep accessibility labels/descriptions consistent with existing components.
- **Animation Performance**: Monitor for main-thread blocks and frame drops, especially on web platform.
- **Offline Performance**: Cache BMKG API responses aggressively, minimize network dependencies.
- **Map Performance**: Optimize GeoJSON rendering, use appropriate zoom levels for data density.
- **Memory Management**: Implement proper cleanup for cached weather data and map resources.

## 15. PWA Integration (Post-Development)
- PWA features should be retrofitted after core development is complete.
- **Core PWA requirements**:
  - Web App Manifest (`public/manifest.json`)
  - Service Worker for offline functionality
  - HTTPS deployment
- **BMKG Data Offline**: Coordinate Service Worker caching with Enhanced File System cached API responses.
- **Map Offline Support**: Service Worker should cache map tiles and BMKG GeoJSON data.
- **Push Notifications**: Integrate with FCM for weather alerts in PWA mode.
- **Implementation timing**: Add PWA capabilities as progressive enhancement, not during initial development.

## 16. Deliverables & PR Hygiene
- Provide concise summaries of changes, referencing affected files.
- Highlight cross-platform considerations and manual testing performed.
- Note offline functionality and BMKG API integration implications.
- **API Integration Testing**: Document BMKG API endpoint testing, rate limiting behavior, and offline fallback testing.
- **Map Visualization**: Document weather data visualization accuracy and maritime zone rendering.
- Document performance considerations when using Reanimated on web.
- Test both online and offline scenarios, including BMKG API failures and cache behavior.
- Document fixes in relevant markdown files when resolving recurring issues.

## 17. Non-Goals / Avoid
- Do **not** create server-side proxies for BMKG APIs - use direct client calls with proper caching.
- Do **not** use Victory Native, TomTom API, expo-maps, or other platform-specific solutions that compromise BMKG data integration.
- Do **not** introduce new global state libraries, networking stacks, or styling systems.
- Do **not** eject from Expo or add native modules requiring custom builds.
- **Avoid storing BMKG data in Firebase** - use Enhanced File System for all weather/earthquake/maritime data caching.
- **Avoid Reanimated for web-critical animations** due to documented performance issues.
- Do **not** use @expo/vector-icons - stick with Lucide for consistency.
- **Avoid exceeding BMKG rate limits** - implement proper throttling and caching strategies.
- Avoid over-engineered abstractions (e.g., dynamic module loaders, custom navigation).

## 18. Cross-Platform Success Criteria
Every new feature should:
1. **Work on native iOS/Android** through Expo Go or development builds
2. **Work on web** through React Native Web with full functionality and good performance
3. **Function offline** with cached BMKG API responses and proper fallback mechanisms
4. **Display BMKG data accurately** with correct Indonesian weather/earthquake/maritime information
5. **Support Firebase Auth + FCM** for user features and weather alert notifications
6. **Be PWA-ready** for future progressive enhancement
7. **Maintain 60fps performance** across all platforms (test animations carefully)
8. **Handle API failures gracefully** with proper fallbacks to cached BMKG data
9. **Respect BMKG rate limits** and provide smooth user experience within API constraints

## 19. Enhanced SDK 54 Features to Leverage
- **Enhanced File System**: Use object-oriented API for BMKG data caching and GeoJSON storage
- **Improved Autolinking**: Trust the enhanced dependency management system for MapLibre setup
- **Built-in localStorage API**: Cross-platform storage compatibility for user preferences
- **Precompiled React Native**: Faster iOS builds (10x improvement)
- **Tree Shaking Improvements**: Smaller bundle sizes automatically

## 20. BMKG Data Integration Strategy
- **Weather Data**: Cache 3-day forecasts per location with 6-hour refresh intervals
- **Earthquake Data**: Cache latest and significant earthquakes with 1-hour refresh intervals  
- **Maritime Data**: Cache maritime zones and weather with 12-hour refresh intervals
- **Data Attribution**: Always display "Data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)" as required
- **Error Handling**: Implement graceful degradation when BMKG APIs are unavailable
- **Rate Limiting Strategy**:
  - Implement request throttling to stay within 60 requests/minute
  - Use cached data aggressively to minimize API calls
  - Batch multiple location requests when possible
  - Show loading states and offline indicators appropriately
- **Data Freshness Management**:
  - Weather forecasts: Refresh every 6 hours or when user explicitly requests
  - Earthquake data: Check for updates every hour or on app foreground
  - Maritime data: Update twice daily (morning/evening)
  - Implement smart refresh logic based on data age and user interaction

---
Following these instructions ensures the app provides accurate Indonesian weather data through direct BMKG API integration while maintaining excellent offline functionality, cross-platform compatibility, and optimal performance using Expo SDK 54's enhanced features.