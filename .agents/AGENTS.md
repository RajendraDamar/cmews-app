# cmews-app — Agent Instructions (PROTOTYPING PHASE)

Expo SDK 54 / React Native 0.81.4 / React 19 / TypeScript weather app for Indonesia.

## Phase: Dynamic Prototyping
We are currently in a prototyping phase. **DO NOT attempt to use real BMKG APIs.** All data must be dynamically mocked. 

## Stack & Architecture
- **Navigation**: Expo Router
- **Styling**: NativeWind 4 + Tailwind, shadcn/ui
- **Charts**: `@shopify/react-native-skia` and `react-native-chart-kit` ONLY.
- **Backend**: DYNAMIC MOCK DATA ONLY.
- **Maps**: `@maplibre/maplibre-react-native` (native), `maplibre-gl@3.6.2` (web).
- **Push Notifications**: Real Expo/Firebase push pathway, but with mocked, randomized payloads.

## Dev Commands
- `npx expo run:android` (EXCLUSIVE command for Android testing)
- `npx expo start --web` (EXCLUSIVE command for Web testing)

## Archiving Rule (Never Delete)
If a file, component, or skill is unused (e.g., redundant charting libraries, real API services), **DO NOT DELETE IT**. Move it to the `_archive/` directory in the project root and add a comment at the top of the file explaining why it was moved: `// Reason: [Explanation]`.

## Critical Rules
1. **Dynamic Mocks:** Weather data must randomize on refresh to simulate live data.
2. **Push Payloads:** Test scripts must send randomized severity alerts (Low, Medium, High) with corresponding color codes for the Android tray icon.
3. **Map Stability:** Never import `.web.tsx` files directly into shared layouts to prevent Hermes runtime crashes on native Android.