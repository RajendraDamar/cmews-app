# cmews-app — Agent Guidelines (PROTOTYPING PHASE)

Expo SDK 54 / React Native 0.81.4 / React 19 / TypeScript weather app for Indonesia.

## 1. Active Phase: Dynamic Prototyping
- **Dynamic Mocks Only**: DO NOT attempt to use real BMKG APIs. All weather data must dynamically randomize on refresh to simulate live conditions.
- **Push Alert Payloads**: Test scripts must send randomized severity alerts (`low`, `medium`, `high`) with corresponding hex color codes for the Android tray icon.
- **Never Delete**: If a file, component, or skill is unused, **DO NOT DELETE IT**. Move it to the `_archive/` directory in the project root with a top comment: `// Reason: [Explanation]`.

## 2. Dev Commands (Exclusive)
- Android testing: `npx expo run:android`
- Web testing: `npx expo start --web`

## 3. Stack & Architecture
- **Navigation**: Expo Router
- **Styling**: NativeWind 4 + Tailwind, shadcn/ui
- **Charts**: `@shopify/react-native-skia` and `react-native-chart-kit` ONLY.
- **Backend**: Dynamic mock data engine only.
- **Maps**: `@maplibre/maplibre-react-native` (native), `maplibre-gl@3.6.2` (web).
- **Push Notifications**: Real Expo/Firebase push pathway with mocked, randomized payloads.

## 4. Platform & Hardware Invariants
1. **Map Stability**: Never import `.web.tsx` files directly into shared layouts to prevent Hermes runtime crashes on native Android.
2. **MapLibre Overlays & SurfaceView Layering**: On native Android, `@maplibre/maplibre-react-native` renders in a native `SurfaceView`. Overlays and bottom sheets must use `<Modal visible={open} transparent animationType="none" statusBarTranslucent>` on native to guarantee elevation above the hardware surface without OS window motion. Web must use in-tree animated containers.
3. **Decoupled Sheet Animations**: Bottom sheets must decouple the dark backdrop (static position, `FadeIn`/`FadeOut`) from the sheet card (`SlideInDown`/`SlideOutDown` / `translateY`). Use `react-native-reanimated` on native to prevent Fabric JS-thread `Animated.Value` stalls.
4. **Navigation Header State Isolation**: Never manage modal/dropdown state inside inline anonymous `headerRight` / `headerLeft` component functions (which unmount and reset state on re-render). Always lift visibility state to the layout level and provide stable `useCallback` renderers.
5. **NativeWind 4 / CSS Interop Safety**: Never pass `className` to non-core/third-party wrappers (such as `GestureHandlerRootView`). Use `style={{ flex: 1 }}` to avoid DEV `printUpgradeWarning` serialization crashes across navigation context boundaries.
6. **MapLibre Marker Anchor Invariance**: Custom native marker components must maintain fixed invariant dimensions (e.g., 44×44) to prevent bitmap anchor shifts on native Android.
7. **NativeWind 4 CSS Transitions Web Scoping**: All CSS transition utilities (e.g., `transition-all`, `transition-colors`, `transition-transform`) MUST use the `web:` prefix modifier (e.g., `web:transition-all`). Unscoped transition classes cause NativeWind to wrap components in `createAnimatedComponent(View)`, crashing on native Android function components.
8. **ThemeProvider Appearance Sync Guard**: Always guard NativeWind runtime color scheme updates with `if (nwColorScheme !== colorScheme)` before invoking `setNWColorScheme(colorScheme)` to prevent emitting global appearance change events during concurrent Fiber mounting.
9. **Desktop Sidebar Invariant Icon Sizing**: Collapsed sidebars (`w-16`) must maintain fixed icon bounding boxes (`h-5 w-5 shrink-0`, constant `size={20}`) with centered `h-10 w-10 mx-auto justify-center px-0` cells to prevent SVG squeeze or misalignment. The top header must persist the brand logo in collapsed state and transition to the expand chevron on hover.
10. **Pragmatic MCP Tooling**: Reach for MCP servers (`context7`, `playwright`, `memory`, `visualization`) when they provide distinct high leverage. Never force MCP calls when native tools (`view_file`, `grep_search`, `replace_file_content`, `run_command`) or direct code actions are simpler.
11. **React DOM 19 Style Array Invariance**: `@rn-primitives` and shared UI wrappers must guard style arrays against boolean/undefined items on Web using `Platform.OS !== 'web' ? [nativeStyle, style] : style` or `StyleSheet.flatten(...)` to prevent `CSSStyleDeclaration` indexing crashes in React DOM 19.
12. **Container Text/Border Contrast Invariance**: Components rendered inside vibrant/dark gradient backgrounds (e.g. `HeroCard`) or tinted alert cards must explicitly pass inline `style={{ color: ... }}` or `style={{ borderColor: ... }}` to prevent Native default theme styles from overriding Tailwind utility colors.
13. **Defensive Mapping Function Normalization**: All UI helper and mapping functions (e.g. `getSeverityBadge`, `getSeverityColor`) must normalize casing, support multilingual keys, and provide fallback return values to prevent `undefined` property crashes.
14. **MapLibre Crossfade Blend Windows**: Never rely on a boolean React state (`isZoomedIn`) to conditionally toggle native layer `filter` props. The React bridge is too slow and will cause visual gaps/stuttering during fast zooms. Instead, keep `clusterMaxZoomLevel` high (e.g., 14) and use native MapLibre interpolation to smoothly fade the clusters out over a 1.0 zoom range (e.g., `circleOpacity: ['interpolate', ['linear'], ['zoom'], 8.5, 1, 9.5, 0]`). This creates a GPU-accelerated "blend window" that perfectly masks the asynchronous mounting delay of React `PointAnnotation` markers.
15. **MapLibre Gesture-Debounced Press Guard**: `handleShapeSourcePress` (and any `onPress` on `ShapeSource`) must ignore taps within 300–500ms of the last `onRegionIsChanging` or `onRegionDidChange` event. Fast pinch releases are frequently misinterpreted by MapLibre's native gesture recognizer as tap events on newly rendered clusters, triggering unwanted camera zoom animations.
16. **PointAnnotation Child Touch Isolation**: Never attach `onTouchEnd`, `onTouchStart`, or `onTouchMove` to child `<View>` components inside `<PointAnnotation>`. These intercept multi-finger pinch/zoom gestures and prevent proper map interaction. Use only the `PointAnnotation.onSelected` callback for selection handling.
17. **Map Marker SVG Bottleneck**: Never use `react-native-svg` (especially `<RadialGradient>`) inside `PointAnnotation` markers on Android. Instantiating and compositing 40+ SVG native canvases during map gestures chokes the UI thread and causes massive lag. Always use standard React Native `elevation`, `shadowColor`, and primitive `<View>` components for marker styling and drop-shadows.
18. **MapLibre JNI Filter Safety**: When passing `filter` expressions to MapLibre layers, never pass naked numbers inside strict equality arrays (e.g. `['==', 1, 2]`) to force boolean visibility. The Android JNI bridge expects expression property keys to be strings and will crash with `"filter property must be a string"`. Use safe string-key checks like `['has', 'fake_property_to_hide']` if you need an always-false condition.
19. **Animation & UI Debugging Workflow**: When diagnosing animation stutters, layout transitions, or complex gesture behaviors (like map panning), NEVER ask the user for static screenshots. Screenshots cannot capture framerate drops or transient visual glitches. Instead, actively instruct the user to capture a screen recording using ADB (`adb shell screenrecord /sdcard/demo.mp4 && adb pull /sdcard/demo.mp4`) and provide the `.mp4` file for temporal analysis.
20. **Cross-Platform Camera Synchronization**: Never use React state (like `webViewState`) and `useEffect` hooks to imperatively drive the MapLibre web camera from external UI buttons (Zoom In/Out, My Location). This causes infinite loops and interaction lockout lagging. Instead, expose a `cameraRef` on Web via `useImperativeHandle` that mimics the Native `MapLibreGL.Camera` API (`cameraRef.current?.setCamera({ zoomLevel, centerCoordinate, animationDuration })`), allowing direct `flyTo` execution that bypasses the React render cycle.
21. **NativeWind Dynamic Icon Contrast Guard**: When rendering vector icons (e.g. Lucide) over dynamic NativeWind backgrounds like `bg-primary`, NEVER hardcode absolute colors like `#FFFFFF`. The `primary` background variable flips to a light color in dark mode. Always compute the explicit icon hex color by explicitly evaluating `colorScheme === 'dark'` (e.g., setting the icon to `#020617` on dark mode and `#FFFFFF` on light mode) to maintain AAA contrast.

## 5. Workspace Skills Index
- `dynamic-mock-engine`: Randomization ranges and payload schemas for prototype weather and push alerts.
- `chart-data-formatting`: Validation bounds, Skia vs ChartKit selection, and temperature color palettes.
- `cache-offline-strategy`: File-based caching (`expo-file-system`), TTL policies, and retry backoff.
- `mcp-tooling-guide`: Optimal triggers, invocation signatures, and workflows for MCP servers (Context7, Playwright, Memory, Zen Browser, GitHub, Firebase, ECharts).