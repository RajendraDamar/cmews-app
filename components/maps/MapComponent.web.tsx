import { useEffect, useRef, useState } from 'react';
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

function getMarkerSvg(weather: string): string {
  const lower = (weather || '').toLowerCase();
  if (lower.includes('hujan lebat')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`;
  }
  if (lower.includes('hujan')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/></svg>`;
  }
  if (lower.includes('cerah')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
  }
  if (lower.includes('kabut') || lower.includes('angin')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7A2.5 2.5 0 1 1 20 10H2"/><path d="M19.7 13.7A2.5 2.5 0 1 0 17 11H2"/><path d="M14.7 17.7A2.5 2.5 0 1 1 12 15H2"/></svg>`;
  }
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'high':
      return '#EF4444';
    case 'medium':
      return '#F59E0B';
    case 'low':
    default:
      return '#10B981';
  }
}

/**
 * Ensures maplibre-gl.css is in the DOM and fully parsed before resolving.
 */
function ensureMaplibreCSS(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve();

    const existingById = document.getElementById('maplibre-gl-css') as HTMLLinkElement | null;
    if (existingById) {
      if (existingById.sheet) return resolve();
      existingById.addEventListener('load', () => resolve(), { once: true });
      existingById.addEventListener('error', () => resolve(), { once: true });
      return;
    }

    const anyMaplibreLink = document.querySelector(
      'link[href*="maplibre-gl"]'
    ) as HTMLLinkElement | null;
    if (anyMaplibreLink) {
      if (anyMaplibreLink.sheet) return resolve();
      anyMaplibreLink.addEventListener('load', () => resolve(), { once: true });
      anyMaplibreLink.addEventListener('error', () => resolve(), { once: true });
      return;
    }

    const link = document.createElement('link');
    link.id = 'maplibre-gl-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css';
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}

export default function MapComponent({
  filteredReports,
  selectedReport,
  onReportSelect,
  webViewState,
  onMoveWeb,
}: WebMapComponentProps) {
  const { height, width } = useWindowDimensions();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { colorScheme } = useTheme();

  const isDesktopViewport = Platform.OS === 'web' && width >= BREAKPOINTS.md;
  const mapPixelHeight = isDesktopViewport ? Math.max(height, 600) : Math.max(height - 60, 600);

  // Dynamically update map style when theme changes without re-mounting
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(colorScheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light);
    }
  }, [colorScheme]);

  // Synchronize camera smoothly when webViewState changes externally
  useEffect(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      const currentZoom = mapRef.current.getZoom();
      const lngDiff = Math.abs(center.lng - webViewState.longitude);
      const latDiff = Math.abs(center.lat - webViewState.latitude);
      const zoomDiff = Math.abs(currentZoom - webViewState.zoom);

      if (lngDiff > 0.001 || latDiff > 0.001 || zoomDiff > 0.1) {
        mapRef.current.flyTo({
          center: [webViewState.longitude, webViewState.latitude],
          zoom: webViewState.zoom,
          duration: 500,
        });
      }
    }
  }, [webViewState.longitude, webViewState.latitude, webViewState.zoom]);

  // Update markers when filteredReports or selectedReport changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Render custom severity markers matching native design
    filteredReports.forEach((report) => {
      const isSelected = selectedReport?.id === report.id;
      const size = isSelected ? 48 : 42;
      const borderWidth = isSelected ? 4 : 3;
      const bgColor = getSeverityColor(report.severity);

      const el = document.createElement('div');
      el.className = 'cmews-severity-marker';
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = `${size / 2}px`;
      el.style.backgroundColor = bgColor;
      el.style.border = `${borderWidth}px solid #FFFFFF`;
      el.style.boxShadow = isSelected
        ? '0 6px 16px rgba(0, 0, 0, 0.45)'
        : '0 4px 10px rgba(0, 0, 0, 0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.cursor = 'pointer';
      el.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
      el.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease, width 0.15s ease, height 0.15s ease';
      el.innerHTML = getMarkerSvg(report.weather);

      el.onmouseenter = () => {
        el.style.transform = 'scale(1.15)';
      };
      el.onmouseleave = () => {
        el.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
      };
      el.onclick = (e) => {
        e.stopPropagation();
        onReportSelect(report);
      };

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([report.lon, report.lat])
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [filteredReports, selectedReport, onReportSelect, isMapLoaded]);

  // Initial Map Setup
  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

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
          setIsMapLoaded(true);

          setTimeout(() => {
            if (isMounted && mapRef.current) mapRef.current.resize();
          }, 100);
        });

        mapRef.current = map;

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
      setIsMapLoaded(false);
      resizeObserver?.disconnect();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: mapPixelHeight,
        position: 'relative',
      }}
    />
  );
}
