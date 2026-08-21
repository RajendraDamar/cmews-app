# cmews-app — Agent Instructions

Expo SDK 54 / React Native 0.81.4 / React 19 / TypeScript weather app for Indonesia (BMKG data).

## Stack
- **Navigation**: Expo Router (file-based, typed routes)
- **Styling**: NativeWind 4 + Tailwind, shadcn/ui design system, `@rn-primitives/*`
- **Charts**: React Native Chart Kit + @shopify/react-native-skia (SmartChartWrapper)
- **State**: Zustand store (`store/`)
- **Backend**: Real BMKG APIs (replace all mock services), Firebase
- **Maps**: MapLibre (native), React Map GL (web)
- **Storage**: AsyncStorage, expo-file-system (CacheService)

## Dev Commands
```bash
npx expo start                  # Start dev server
npx expo run:android            # Run on Android
npx expo run:ios                # Run on iOS
npx expo start --web            # Run web version
npx expo-doctor                 # Project diagnostics
npm run lint                    # ESLint check
```

## Folder Map
```
app/            # Expo Router pages (file-based routing)
  (tabs)/       # Tab navigation layout
components/     # Reusable UI components
  charts/       # Chart components (ChartKit, Skia, SmartChartWrapper)
  ui/           # shadcn/ui primitives
lib/
  services/     # API services (BMKGService, WeatherService, CacheService)
  data/         # Static data, wilayah mappings
  utils/        # Data processing (bmkg-processor)
  notifications/# Push notification service
store/          # Zustand stores
hooks/          # Custom React hooks
constants/      # App constants, theme tokens
assets/         # Images, fonts
```

## Coding Conventions

### TypeScript
- Strict mode required. No `any` unless interfacing with external untyped APIs.
- Functional components with hooks only. No class components.
- Use `interface` for object shapes, `type` for unions/intersections.

### Styling
- Use NativeWind/Tailwind classes exclusively. No inline `style={{}}` objects.
- Dark mode: always provide both light/dark variants using `dark:` prefix.
- Use design tokens from `constants/` for colors, spacing, typography.

### State Management
- Zustand for global state. No Redux, no Context API for data.
- Keep store slices focused (weather, location, settings).

### Components
- Use `@rn-primitives/*` for base UI elements (Text, Button, Card, etc.).
- Charts: always validate data before rendering. Handle empty states gracefully.
- Use SmartChartWrapper for automatic Skia/ChartKit platform selection.

### API Integration
- Always cache BMKG API responses (see `cache-offline-strategy` skill).
- Handle network failures with retry logic + user-friendly messages.
- Validate data structure before processing (see `bmkg-api-integration` skill).
- BMKG forecast: exactly 3 days, 8 forecasts/day, 3-hour intervals.

### Cross-Platform
- All features must work on iOS, Android, and web.
- Maps: MapLibre for native, React Map GL for web.
- Test on all three platforms before marking complete.

## Critical Rules
- **DO NOT** use mock services in production code. Replace with real BMKG APIs.
- **DO NOT** commit `.env` files or API keys.
- **DO NOT** use `expo-secure-store` on web (not supported). Use AsyncStorage with encryption wrapper.
- **ALWAYS** run `npx expo-doctor` after adding new packages.
- **ALWAYS** implement loading skeletons for async data fetches.
- ESLint must pass with max 25 warnings. Prettier formatting enforced.
- Production build must succeed before merging.

## Detailed Skills (Loaded On-Demand)
For detailed implementation blueprints, the agent should reference these project skills:
- **bmkg-api-integration**: API endpoints, response formats, data processing, validation
- **chart-data-formatting**: Chart rendering, SmartChartWrapper, data visualization
- **cache-offline-strategy**: CacheService, TTL rules, retry logic, error handling

## Excluded Features
- Earthquake API (not implemented)
- International weather (Indonesia only)
- Port weather (maritime = open waters only)
- Historical data (current + forecast only)