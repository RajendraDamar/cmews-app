// Maps Tab - Weather Observation Reporting Platform
import { View, Platform, Pressable, useWindowDimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CollapsibleSearch } from '~/components/maps/collapsible-search';
import { SeverityMarker } from '~/components/maps/severity-marker';
import { ReportBottomSheet } from '~/components/maps/report-bottom-sheet';
import { ReportFormDialog } from '~/components/maps/report-form-dialog';
import { DesktopSidebar } from '~/components/maps/desktop-sidebar';
import { WeatherLayerToggle } from '~/components/maps/weather-layer-toggle';
import { MapSkeleton } from '~/components/maps/map-skeleton';
import { MapErrorState } from '~/components/maps/map-error-state';
import { Text } from '~/components/ui/text';
import { Plus, Minus, MapPin } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { mockWeatherReports } from '~/lib/data/weather-reports-mock';
import { WeatherReport, WeatherReportFilters } from '~/lib/types/weather-report';

// Import MapLibre theme for web
if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('maplibre-theme/icons.lucide.css');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('maplibre-theme/modern.css');
}

// Conditionally import MapLibre based on platform
let MapLibreGL: any = null;
let MapGL: any = null;

if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    MapLibreGL = require('@maplibre/maplibre-react-native').default;
    MapLibreGL?.setAccessToken?.(null);
  } catch (error) {
    console.error('Failed to load MapLibre:', error);
  }
} else {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ReactMapGL = require('react-map-gl/maplibre');
    MapGL = ReactMapGL.default;
  } catch (error) {
    console.error('Failed to load react-map-gl:', error);
  }
}

function WebMap() {
  const [viewState, setViewState] = useState({
    longitude: 106.8272,
    latitude: -6.1754,
    zoom: 11,
  });

  if (!MapGL) {
    return (
      <View className="flex-1 items-center justify-center bg-muted">
        <Text variant="muted" size="xl">
          Map unavailable on web
        </Text>
      </View>
    );
  }

  return (
    <View className="maplibregl-map" style={{ width: '100%', height: '100%' }}>
      <MapGL
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        dragRotate={true}
        pitchWithRotate={true}
      />
    </View>
  );
}

export default function MapsScreen() {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showWeatherLayer, setShowWeatherLayer] = useState(false);
  const [filters, setFilters] = useState<WeatherReportFilters>({
    all: true,
    low: true,
    medium: true,
    high: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [reports, setReports] = useState<WeatherReport[]>(mockWeatherReports);
  const cameraRef = useRef<any>(null);

  // Calculate exact map height for full screen
  const mapHeight = height - insets.top - insets.bottom;

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setMapError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleLocationPress = () => {
    // Center to Jakarta
    if (Platform.OS !== 'web' && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [106.8272, -6.1754],
        zoomLevel: 11,
        animationDuration: 1000,
      });
    }
  };

  const handleZoomIn = () => {
    if (Platform.OS !== 'web' && cameraRef.current) {
      cameraRef.current.zoomTo(15, 500);
    }
  };

  const handleZoomOut = () => {
    if (Platform.OS !== 'web' && cameraRef.current) {
      cameraRef.current.zoomTo(9, 500);
    }
  };

  const handleReportSelect = (report: WeatherReport) => {
    setSelectedReport(report);
    if (Platform.OS !== 'web' && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [report.lon, report.lat],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  };

  const handleReportSubmit = (data: any) => {
    const newReport: WeatherReport = {
      id: Date.now().toString(),
      location: data.location,
      lat: -6.1754,
      lon: 106.8272,
      weather: data.weather,
      severity: data.severity,
      temperature: data.temperature,
      humidity: 70,
      windSpeed: data.windSpeed,
      windDirection: 'Utara',
      notes: data.notes,
      user: {
        name: 'Anda',
        initials: 'A',
      },
      timestamp: new Date().toISOString(),
    };
    setReports([newReport, ...reports]);
    setShowReportForm(false);
  };

  const filteredReports = reports.filter((report) => {
    if (filters.all) return true;
    return filters[report.severity];
  });

  const iconColor = colorScheme === 'dark' ? '#e5e7eb' : '#1f2937';

  // Desktop Sidebar
  const renderDesktopSidebar = () => (
    <DesktopSidebar
      selectedReport={selectedReport}
      recentReports={filteredReports.slice(0, 10)}
      filters={filters}
      onFilterChange={setFilters}
      onSelectReport={handleReportSelect}
    />
  );

  // Map View with Markers
  const renderMap = () => {
    if (isLoading) {
      return <MapSkeleton />;
    }

    if (mapError) {
      return <MapErrorState message={mapError} onRetry={handleRetry} />;
    }

    return (
      <View style={{ flex: 1, height: isDesktop ? '100%' : mapHeight }}>
        {Platform.OS === 'web' ? (
          <WebMap />
        ) : MapLibreGL ? (
          <MapLibreGL.MapView
            style={{ flex: 1 }}
            styleURL="https://demotiles.maplibre.org/style.json"
            logoEnabled={false}
            attributionEnabled={false}
            compassEnabled={!isDesktop}
            compassViewMargins={{ x: 16, y: 100 }}
            rotateEnabled={true}
            pitchEnabled={true}>
            <MapLibreGL.Camera
              ref={cameraRef}
              zoomLevel={11}
              centerCoordinate={[106.8272, -6.1754]}
              animationMode="flyTo"
              animationDuration={1000}
            />

            {/* Weather Report Markers */}
            {filteredReports.map((report) => (
              <MapLibreGL.MarkerView key={report.id} coordinate={[report.lon, report.lat]}>
                <SeverityMarker
                  report={report}
                  onPress={() => handleReportSelect(report)}
                  selected={selectedReport?.id === report.id}
                />
              </MapLibreGL.MarkerView>
            ))}
          </MapLibreGL.MapView>
        ) : (
          <MapErrorState
            message="MapLibre is not available"
            onRetry={() => {
              /* Reload the app */
            }}
          />
        )}
      </View>
    );
  };

  return (
    <View className="flex-1">
      {isDesktop ? (
        <View className="flex-1 flex-row">
          {renderDesktopSidebar()}
          <View className="relative flex-[0.7]">
            {renderMap()}
            {/* Collapsible Search */}
            <CollapsibleSearch placeholder="Cari lokasi..." />
            {/* Weather Layer Toggle (Desktop) */}
            <WeatherLayerToggle
              showLayer={showWeatherLayer}
              onToggle={() => setShowWeatherLayer(!showWeatherLayer)}
            />
            {/* Map Controls (Desktop - Right Side) */}
            {Platform.OS !== 'web' && MapLibreGL && (
              <View className="absolute right-8 top-1/3 gap-2" style={{ zIndex: 10 }}>
                <Pressable
                  onPress={handleZoomIn}
                  className="h-12 w-12 items-center justify-center rounded-lg border border-border bg-card shadow-lg active:opacity-70">
                  <Plus size={24} color={iconColor} />
                </Pressable>

                <Pressable
                  onPress={handleZoomOut}
                  className="h-12 w-12 items-center justify-center rounded-lg border border-border bg-card shadow-lg active:opacity-70">
                  <Minus size={24} color={iconColor} />
                </Pressable>

                <Pressable
                  onPress={handleLocationPress}
                  className="h-12 w-12 items-center justify-center rounded-lg border border-border bg-card shadow-lg active:opacity-70">
                  <MapPin size={20} color={iconColor} />
                </Pressable>
              </View>
            )}
            {/* Floating Action Button (Desktop) */}
            <Pressable
              onPress={() => setShowReportForm(true)}
              className="absolute bottom-8 right-8 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg active:opacity-90"
              style={{ zIndex: 10 }}>
              <Plus size={28} color="#fff" />
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          {renderMap()}

          {/* Mobile Overlays */}
          {/* Collapsible Search */}
          <CollapsibleSearch placeholder="Cari lokasi..." />

          {/* Weather Layer Toggle (Mobile) */}
          <WeatherLayerToggle
            showLayer={showWeatherLayer}
            onToggle={() => setShowWeatherLayer(!showWeatherLayer)}
          />

          {/* Map Controls (Mobile - Right Side) */}
          {Platform.OS !== 'web' && MapLibreGL && (
            <View className="absolute bottom-32 right-4 gap-2" style={{ zIndex: 10 }}>
              <Pressable
                onPress={handleZoomIn}
                className="h-12 w-12 items-center justify-center rounded-lg border border-border bg-card shadow-lg active:opacity-70">
                <Plus size={24} color={iconColor} />
              </Pressable>

              <Pressable
                onPress={handleZoomOut}
                className="h-12 w-12 items-center justify-center rounded-lg border border-border bg-card shadow-lg active:opacity-70">
                <Minus size={24} color={iconColor} />
              </Pressable>

              <Pressable
                onPress={handleLocationPress}
                className="h-12 w-12 items-center justify-center rounded-lg border border-border bg-card shadow-lg active:opacity-70">
                <MapPin size={20} color={iconColor} />
              </Pressable>
            </View>
          )}

          {/* Floating Action Button (Mobile) */}
          <Pressable
            onPress={() => setShowReportForm(true)}
            className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg active:opacity-90"
            style={{ zIndex: 10 }}>
            <Plus size={28} color="#fff" />
          </Pressable>

          {/* Bottom Sheet for Report Details (Mobile) */}
          {selectedReport && (
            <ReportBottomSheet report={selectedReport} onClose={() => setSelectedReport(null)} />
          )}

          {/* Report Form Dialog */}
          {showReportForm && (
            <ReportFormDialog
              location="Lokasi Terpilih"
              onSubmit={handleReportSubmit}
              onCancel={() => setShowReportForm(false)}
            />
          )}
        </>
      )}
    </View>
  );
}
