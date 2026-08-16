import { useEffect, useRef } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useTheme } from '~/lib/theme-provider';
import { WeatherReport } from '~/lib/types/weather-report';
import { BREAKPOINTS } from '~/lib/breakpoints';
import { MAP_STYLES } from '~/lib/constants';
import maplibregl from 'maplibre-gl/dist/maplibre-gl';

interface WebMapComponentProps {
  filteredReports: WeatherReport[];
  selectedReport: WeatherReport | null;
  onReportSelect: (report: WeatherReport) => void;
  webViewState: { longitude: number; latitude: number; zoom: number };
  onMoveWeb: (evt: any) => void;
}

/**
 * Ensures maplibre-gl.css is in the DOM and **fully parsed** by the browser
 * before resolving. This is critical — if Map() runs before the stylesheet
 * attaches, the WebGL canvas measures 0×0 px and permanently renders grey.
 *
 * Checks three cases in order:
 *  1. Link with id="maplibre-gl-css" already injected (previous render)
 *  2. Any <link href*="maplibre-gl"> from +html.tsx or _layout.tsx require()
 *  3. No CSS found — inject CDN fallback and wait for onload
 */
function ensureMaplibreCSS(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve();

    // Case 1: Our own injected link
    const existingById = document.getElementById('maplibre-gl-css') as HTMLLinkElement | null;
    if (existingById) {
      if (existingById.sheet) return resolve(); // Already parsed
      existingById.addEventListener('load', () => resolve(), { once: true });
      existingById.addEventListener('error', () => resolve(), { once: true });
      return;
    }

    // Case 2: Link from +html.tsx (static) or _layout.tsx (require())
    const anyMaplibreLink = document.querySelector(
      'link[href*="maplibre-gl"]'
    ) as HTMLLinkElement | null;
    if (anyMaplibreLink) {
      if (anyMaplibreLink.sheet) return resolve();
      anyMaplibreLink.addEventListener('load', () => resolve(), { once: true });
      anyMaplibreLink.addEventListener('error', () => resolve(), { once: true });
      return;
    }

    // Case 3: Inject CDN fallback — pin to 3.6.2 to match installed package
    const link = document.createElement('link');
    link.id = 'maplibre-gl-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css';
    link.onload = () => resolve();
    link.onerror = () => resolve(); // Unblock map even on CDN failure
    document.head.appendChild(link);
  });
}

export default function MapComponent({
  filteredReports,
  onReportSelect,
  webViewState,
  onMoveWeb,
}: WebMapComponentProps) {
  const { height, width } = useWindowDimensions();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const { colorScheme } = useTheme();

  // On desktop (>= 768 px) the tab bar is physically unmounted, so use full height.
  // On mobile, subtract the 60 px tab bar to avoid overflow.
  const isDesktopViewport = Platform.OS === 'web' && width >= BREAKPOINTS.md;
  // Explicit numeric JS height — never a CSS calc() string
  // (React Native Web strips calc() from inline styles, collapsing to 0px)
  const mapPixelHeight = isDesktopViewport ? Math.max(height, 600) : Math.max(height - 60, 600);

  // Dynamically update map style when theme changes without re-mounting the map instance
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(colorScheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light);
    }
  }, [colorScheme]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Guard: prevents stale .then() callbacks after cleanup/unmount
    let isMounted = true;
    // Declared in outer scope so cleanup closure can disconnect it
    let resizeObserver: ResizeObserver | null = null;

    // Tear down any previous instance (e.g. on re-mount)
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // ─── CRITICAL: CSS must be fully loaded before Map() runs ─────────────────
    // If Map() executes before CSS attaches, .maplibregl-canvas-container
    // has no dimensions → WebGL canvas measures 0×0 px → permanent grey box.
    // ensureMaplibreCSS() resolves only after link.onload fires.
    // ──────────────────────────────────────────────────────────────────────────
    ensureMaplibreCSS().then(() => {
      if (!isMounted || !containerRef.current) return;

      try {
        const activeStyle = colorScheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light;
        const map = new maplibregl.Map({
          container: containerRef.current,
          style: activeStyle,
          center: [webViewState.longitude, webViewState.latitude],
          zoom: webViewState.zoom,
          attributionControl: true,
        });

        map.on('move', () => {
          const center = map.getCenter();
          onMoveWeb({
            viewState: {
              longitude: center.lng,
              latitude: center.lat,
              zoom: map.getZoom(),
            },
          });
        });

        map.on('load', () => {
          if (!isMounted) return;

          // Add coloured dot markers for each weather report
          filteredReports.forEach((report) => {
            const el = document.createElement('div');
            el.style.width = '18px';
            el.style.height = '18px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor =
              report.severity === 'high'
                ? '#ef4444'
                : report.severity === 'medium'
                  ? '#f59e0b'
                  : '#3b82f6';
            el.style.border = '2px solid white';
            el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.35)';
            el.style.cursor = 'pointer';
            el.onclick = () => onReportSelect(report);

            new maplibregl.Marker(el)
              .setLngLat([report.lon, report.lat])
              .setPopup(
                new maplibregl.Popup({ offset: 25 }).setText(
                  `${report.location}: ${report.weather}`
                )
              )
              .addTo(map);
          });

          // Force WebGL repaint after browser flexbox layout settles
          setTimeout(() => {
            if (isMounted && mapRef.current) mapRef.current.resize();
          }, 100);
        });

        mapRef.current = map;

        // ResizeObserver: call map.resize() whenever the container changes size
        // (sidebar expand/collapse, window resize, orientation change, etc.)
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
          resizeObserver = new ResizeObserver(() => {
            if (mapRef.current) mapRef.current.resize();
          });
          resizeObserver.observe(containerRef.current);
        }
      } catch (error) {
        console.error('Failed to initialize MapLibre Web:', error);
      }
    });

    return () => {
      isMounted = false;
      resizeObserver?.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // No color-scheme dependency: raster tiles have a single style,
    // so no map re-init needed when theme changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        // '100%' fills the flex parent without overflowing past the sidebar.
        // A raw HTML <div> accepts '100%' width correctly.
        width: '100%',
        // Explicit JS numeric height — never CSS calc()
        height: mapPixelHeight,
        position: 'relative',
      }}
    />
  );
}
