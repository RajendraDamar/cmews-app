import { useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useTheme } from '~/lib/theme-provider';
import { WeatherReport } from '~/lib/types/weather-report';
import { BREAKPOINTS } from '~/lib/breakpoints';
import { MAP_STYLES } from '~/lib/constants';
import maplibregl from 'maplibre-gl/dist/maplibre-gl';
import { lngLatToPixels } from '~/lib/utils/mercator';

interface WebMapComponentProps {
  filteredReports: WeatherReport[];
  selectedReport: WeatherReport | null;
  onReportSelect: (report: WeatherReport) => void;
  onReportDeselect?: () => void;
  webViewState: { longitude: number; latitude: number; zoom: number };
  onMoveWeb: (evt: any) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  onMapPress?: (coords: [number, number]) => void;
  cameraRef?: any;
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

function getSeverityColor(severity?: string): string {
  switch (severity?.toLowerCase()) {
    case 'high':
    case 'tinggi':
      return '#EF4444';
    case 'medium':
    case 'sedang':
      return '#F59E0B';
    case 'low':
    case 'rendah':
    default:
      return '#10B981';
  }
}

/**
 * Ensures maplibre-gl.css and custom marker + cluster animation styles are in the DOM.
 */
function ensureMaplibreCSS(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve();

    // Inject custom animation and cluster styles if missing
    if (!document.getElementById('cmews-map-marker-keyframes')) {
      const style = document.createElement('style');
      style.id = 'cmews-map-marker-keyframes';
      style.innerHTML = `
        @keyframes cmews-pulse {
          0% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1.6); opacity: 0; box-shadow: 0 0 0 14px rgba(59, 130, 246, 0); }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .cmews-user-location-container {
          position: relative;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .cmews-user-location-pulse {
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.4);
          animation: cmews-pulse 2s infinite ease-out;
        }
        .cmews-user-location-dot {
          position: relative;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
          z-index: 2;
        }
      `;
      document.head.appendChild(style);
    }

    const existingById = document.getElementById('maplibre-gl-css') as HTMLLinkElement | null;
    if (existingById) {
      if (existingById.sheet) return resolve();
      existingById.addEventListener('load', () => resolve(), { once: true });
      existingById.addEventListener('error', () => resolve(), { once: true });
      return;
    }

    const anyMaplibreLink = document.querySelector(
      'link[rel="stylesheet"][href*="maplibre-gl"]'
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
  onReportDeselect,
  webViewState,
  onMoveWeb,
  userLocation,
  onMapPress,
  cameraRef,
}: WebMapComponentProps) {
  const { height, width } = useWindowDimensions();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const { colorScheme } = useTheme();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const isDesktopViewport = Platform.OS === 'web' && width >= BREAKPOINTS.md;
  const mapPixelHeight = isDesktopViewport ? Math.max(height, 600) : Math.max(height - 60, 600);

  const isInteractingRef = useRef(false);
  const lastUserInteractionTimeRef = useRef(0);

  // Expose imperative setCamera for external buttons (Zoom / Location)
  useImperativeHandle(cameraRef, () => ({
    setCamera: (config: { zoomLevel?: number; centerCoordinate?: [number, number]; animationDuration?: number }) => {
      if (!mapRef.current) return;
      const options: any = { duration: config.animationDuration || 500 };
      if (config.centerCoordinate) options.center = config.centerCoordinate;
      if (config.zoomLevel !== undefined) options.zoom = config.zoomLevel;
      
      lastUserInteractionTimeRef.current = 0; // Prevent onMove from bouncing
      mapRef.current.flyTo(options);
    }
  }));

  // Refs for latest prop values (used inside stable callbacks)
  const filteredReportsRef = useRef(filteredReports);
  const selectedReportRef = useRef(selectedReport);
  const onReportSelectRef = useRef(onReportSelect);
  filteredReportsRef.current = filteredReports;
  selectedReportRef.current = selectedReport;
  onReportSelectRef.current = onReportSelect;

  const syncMarkers = useCallback(() => {
    if (!mapRef.current || !isMapLoaded) return;

    // Clear existing report/cluster markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Clear and render User Location Marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const userEl = document.createElement('div');
      userEl.className = 'cmews-user-location-container';
      userEl.title = 'Lokasi Anda Saat Ini';

      const pulse = document.createElement('div');
      pulse.className = 'cmews-user-location-pulse';

      const dot = document.createElement('div');
      dot.className = 'cmews-user-location-dot';

      userEl.appendChild(pulse);
      userEl.appendChild(dot);

      const userMarker = new maplibregl.Marker({ element: userEl, anchor: 'center' })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(mapRef.current);

      userMarkerRef.current = userMarker;
    }

    const currentZoom = mapRef.current.getZoom();

    // ── Render Individual Weather Markers (Harmonized 36px Sizing) ──
    filteredReportsRef.current.forEach((report) => {
      const isSelected = selectedReportRef.current?.id === report.id;
      
      let size = 36;
      let borderWidth = 2;
      let showIcon = true;
      
      if (isSelected) {
        size = 44;
        borderWidth = 3.5;
        showIcon = true;
      } else if (currentZoom < 7) {
        size = 12;
        borderWidth = 0;
        showIcon = false;
      } else if (currentZoom < 10) {
        size = 24;
        borderWidth = 1;
        showIcon = false;
      }

      const bgColor = getSeverityColor(report.severity);

      const inner = document.createElement('div');
      inner.className = `cmews-severity-marker ${isSelected ? 'selected' : ''}`;
      inner.dataset.reportId = report.id;
      inner.style.width = `${size}px`;
      inner.style.height = `${size}px`;
      inner.style.borderRadius = `${size / 2}px`;
      inner.style.backgroundColor = bgColor;
      inner.style.border = `${borderWidth}px solid #FFFFFF`;
      inner.style.boxShadow = 'none';
      inner.style.display = 'flex';
      inner.style.alignItems = 'center';
      inner.style.justifyContent = 'center';
      inner.style.cursor = 'pointer';
      inner.style.zIndex = isSelected ? '20' : '10';
      inner.style.transition = 'width 0.15s ease, height 0.15s ease, border-width 0.15s ease, border-radius 0.15s ease';
      
      inner.innerHTML = getMarkerSvg(report.weather);
      
      const svg = inner.querySelector('svg');
      if (svg) {
        svg.style.display = showIcon ? 'block' : 'none';
      }

      inner.onclick = (e) => {
        e.stopPropagation();
        onReportSelectRef.current(report);
      };

      const marker = new maplibregl.Marker({ element: inner, anchor: 'center' })
        .setLngLat([report.lon, report.lat])
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [isMapLoaded, userLocation]);

  // Trigger marker sync when reports, selection, or location change
  useEffect(() => {
    syncMarkers();
  }, [syncMarkers, filteredReports, selectedReport]);

  // Update map style when theme changes dynamically without losing markers
  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      const activeStyle = colorScheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light;
      mapRef.current.setStyle(activeStyle);
      mapRef.current.once('styledata', () => {
        syncMarkers();
      });
    }
  }, [colorScheme, isMapLoaded, syncMarkers]);

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
          attributionControl: false,
        });

        const handleInteractionStart = () => {
          isInteractingRef.current = true;
          lastUserInteractionTimeRef.current = Date.now();
        };

        const handleInteractionEnd = () => {
          lastUserInteractionTimeRef.current = Date.now();
          isInteractingRef.current = false;
          if (map) {
            const center = map.getCenter();
            const zoom = map.getZoom();
            onMoveWeb({
              viewState: {
                longitude: center.lng,
                latitude: center.lat,
                zoom,
              },
            });
          }
        };

        map.on('dragstart', handleInteractionStart);
        map.on('dragend', handleInteractionEnd);
        map.on('zoomstart', handleInteractionStart);
        map.on('zoomend', handleInteractionEnd);
        map.on('moveend', handleInteractionEnd);

        // Dynamically scale markers based on zoom without recreating them
        map.on('zoom', () => {
          const currentZoom = map.getZoom();
          const markerElements = document.querySelectorAll('.cmews-severity-marker');
          
          markerElements.forEach(el => {
            const div = el as HTMLDivElement;
            const isSelected = div.classList.contains('selected');
            
            let size = 36;
            let borderWidth = 2;
            let showIcon = true;
            
            if (isSelected) {
              size = 44;
              borderWidth = 3.5;
              showIcon = true;
            } else if (currentZoom < 7) {
              size = 12;
              borderWidth = 0;
              showIcon = false;
            } else if (currentZoom < 10) {
              size = 24;
              borderWidth = 1;
              showIcon = false;
            }
            
            div.style.width = `${size}px`;
            div.style.height = `${size}px`;
            div.style.borderRadius = `${size / 2}px`;
            div.style.borderWidth = `${borderWidth}px`;
            
            const svg = div.querySelector('svg');
            if (svg) {
              svg.style.display = showIcon ? 'block' : 'none';
            }
          });
        });


        map.on('click', (e) => {
          if (onMapPress) {
            onMapPress([e.lngLat.lng, e.lngLat.lat]);
          }
        });

        map.on('load', () => {
          if (!isMounted) return;
          setIsMapLoaded(true);
          syncMarkers();

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
      resizeObserver?.disconnect();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
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
