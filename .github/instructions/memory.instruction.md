---
applyTo: '**'
---

# User Memory

## User Preferences
- Programming languages: TypeScript, React Native
- Code style preferences: Tailwind-style classes via NativeWind, use `cn()` helper for conditional classes
- Development environment: Expo managed workflow, VS Code on Windows
- Communication style: concise, iterative, hands-on edits

## Project Context
- Current project type: Cross-platform Expo app (Native + Web)
- Tech stack: Expo SDK 54, React Native 0.81, TypeScript, Expo Router, NativeWind/Tailwind, React Native Web
- Architecture patterns: File-based routing (Expo Router), ThemeProvider with CSS tokens for web and JS color tokens for native

## Coding Patterns
- Prefer small reusable UI components under `components/`
- Mock-driven frontend-first approach: `lib/data/*` supplies mock BMKG data
- Use React hooks for local state; Zustand for global state in `store/store.ts`

## Context7 Research History
- (empty) - populate when Context7 research occurs

## Conversation History
- Fixed worklets runtime error by removing duplicate dependency and avoiding Reanimated plugin on web
- Replaced Reanimated-based skeleton animation with RN Animated for web compatibility
- Iterated on FAB theming across `app/(tabs)/maps.tsx` and `components/maps/desktop-map-panel.tsx` to match `WeatherLayerToggle` styles

## Notes
- Track CSS token reads on web (`--card`, `--card-foreground`) and JS theme fallback (`getThemeColor`)
- Memory updated after each major edit
