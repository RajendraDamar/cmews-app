# Testing the CMEWS App on Android

## Prerequisites
- Install Expo Go app from Google Play Store on your Android device
- Ensure your device and development computer are on the same network

## Testing with Expo Go

### Method 1: Using Expo Go (Recommended for Quick Testing)

1. **Start the development server:**
   ```bash
   npm start
   # or
   expo start
   ```

2. **Connect your Android device:**
   - Open Expo Go app on your Android device
   - Scan the QR code shown in terminal or browser
   - The app will load and run on your device

3. **Expected Behavior:**
   - The app should load with the new weather-themed interface
   - On mobile: Bottom tab navigation (Home, Forecast, Maps)
   - On larger screens: Vertical sidebar navigation
   - Maps should render using MapLibre

### Method 2: Development Build (For Full Native Features)

If you encounter issues with Expo Go (especially with MapLibre native modules), you'll need to create a development build:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS:**
   ```bash
   eas build:configure
   ```

3. **Create a development build:**
   ```bash
   eas build --profile development --platform android
   ```

4. **Install the build on your device:**
   - Download the APK from the EAS build
   - Install it on your Android device
   - Run the app

5. **Start the development server:**
   ```bash
   expo start --dev-client
   ```

## Known Limitations with Expo Go

### Features that WON'T work in Expo Go:
- **MapLibre Native Module**: The full MapLibre native functionality requires a custom development build
- **Notifications**: Push notifications require native configuration
- **Custom Native Modules**: Any custom native code won't work

### Workarounds for Expo Go:
- The app is configured to show a fallback message if MapLibre fails to load
- Web version of the map will work in browsers
- For full map testing, use a development build

## Testing the Maps Feature

### With Development Build:
- All MapLibre features should work:
  - Pan, zoom, rotate, pitch
  - User location marker
  - Zoom controls
  - Compass
  - Search functionality

### With Expo Go:
- You may see "Map unavailable" message
- This is expected due to native module limitations
- The rest of the app (Home, Forecast tabs) should work fine

## Troubleshooting

### "MapLibre native module not registered" error:
**Cause**: MapLibre requires native code that isn't included in Expo Go

**Solution**: 
1. Use a development build (recommended)
2. Or test the web version for map functionality

### App crashes on startup:
**Cause**: Possible compatibility issue with Expo SDK

**Solution**:
1. Clear Expo Go cache: Settings > Clear Cache
2. Restart the development server
3. Try creating a development build

### Theme not applied correctly:
**Cause**: Theme provider initialization issue

**Solution**:
1. Force close the app
2. Restart the development server
3. Reload the app

### Maps show blank screen:
**Cause**: Network issue or MapLibre style URL not loading

**Solution**:
1. Check internet connection
2. Try different map style URL in `app/(tabs)/maps.tsx`
3. Check console logs for errors

## Building for Production

For production builds, use:

```bash
# Android
eas build --platform android

# iOS  
eas build --platform ios
```

Production builds will include all native modules and features will work as expected.

## Current App Features

### Home Tab
- Today's weather forecast
- Hourly forecast (horizontal scroll)
- Weather details (humidity, wind, UV, visibility)

### Forecast Tab
- 3-day forecast with tabs
- 3-hour interval data (8 data points per day = 24 data points total)
- Detailed weather metrics per time slot

### Maps Tab (Requires Development Build)
- Interactive map with pan/zoom/rotate
- User location marker
- Zoom in/out buttons
- Location centering button
- Search functionality
- Place details cards

### Navigation
- **Mobile/Tablet**: Bottom tab navigation
- **Desktop (>= 1024px)**: Vertical sidebar navigation with profile at bottom

## Mock Data

All weather data is currently mocked for prototype purposes. In production:
- Connect to a weather API (OpenWeatherMap, WeatherAPI, etc.)
- Implement real geolocation
- Add real-time weather updates
