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
4. **MapLibre Overlays & SurfaceView Layering:** On native Android, `@maplibre/maplibre-react-native` renders in a native `SurfaceView`. Overlays and bottom sheets must use `<Modal visible={open} transparent animationType="none" statusBarTranslucent>` on native to guarantee elevation above the hardware surface without OS window motion. Web must use in-tree animated containers.
5. **Decoupled Sheet Animations:** Bottom sheets must decouple the dark backdrop (static position, `FadeIn`/`FadeOut`) from the sheet card (`SlideInDown`/`SlideOutDown` / `translateY`). Use `react-native-reanimated` on native to prevent Fabric JS-thread `Animated.Value` stalls.
6. **Navigation Header State Isolation:** Never manage modal/dropdown state inside inline anonymous `headerRight` / `headerLeft` component functions (which unmount and reset state on re-render). Always lift visibility state to the layout level and provide stable `useCallback` renderers.
7. **NativeWind 4 / CSS Interop Safety:** Never pass `className` to non-core/third-party wrappers (such as `GestureHandlerRootView`). Use `style={{ flex: 1 }}` to avoid DEV `printUpgradeWarning` serialization crashes across navigation context boundaries.
8. **MapLibre Marker Anchor Invariance:** Custom native marker components must maintain fixed invariant dimensions (e.g., 44×44) to prevent bitmap anchor shifts on native Android.
9. **NativeWind 4 CSS Transitions Web Scoping:** All CSS transition utilities (e.g., `transition-all`, `transition-colors`, `transition-transform`) MUST use the `web:` prefix modifier (e.g., `web:transition-all`). Unscoped transition classes cause NativeWind to wrap components in `createAnimatedComponent(View)`, crashing on native Android function components.
10. **ThemeProvider Appearance Sync Guard:** Always guard NativeWind runtime color scheme updates with `if (nwColorScheme !== colorScheme)` before invoking `setNWColorScheme(colorScheme)` to prevent emitting global appearance change events during concurrent Fiber mounting.
11. **Desktop Sidebar Invariant Icon Sizing:** Collapsed sidebars (`w-16`) must maintain fixed icon bounding boxes (`h-5 w-5 shrink-0`, constant `size={20}`) with centered `h-10 w-10 mx-auto justify-center px-0` cells to prevent SVG squeeze or misalignment. The top header must persist the brand logo in collapsed state and transition to the expand chevron on hover.