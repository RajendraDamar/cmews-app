import { View, Platform, Pressable } from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CollapsibleSearch } from '~/components/maps/collapsible-search';
import { ReportBottomSheet } from '~/components/maps/report-bottom-sheet';
import { ReportFormDialog } from '~/components/maps/report-form-dialog';
import { DesktopMapPanel } from '~/components/maps/desktop-map-panel';
import { MapSkeleton } from '~/components/maps/map-skeleton';
import { MapErrorState } from '~/components/maps/map-error-state';
import MapComponent from '~/components/maps/MapComponent';
import { Plus, Minus, MapPin } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { mockWeatherReports } from '~/lib/data/weather-reports-mock';
import { WeatherReport, WeatherReportFilters } from '~/lib/types/weather-report';
import { getThemeColor } from '~/lib/constants';

export default function MapsScreen() {
  const { colorScheme } = useTheme();
  const { isDesktop } = useBreakpoint();
  const insets = useSafeAreaInsets();
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [filters] = useState<WeatherReportFilters>({
    all: true,
    low: true,
    medium: true,
    high: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [reports, setReports] = useState<WeatherReport[]>(mockWeatherReports);
  const cameraRef = useRef<any>(null);
  const lastMarkerSelectTimeRef = useRef<number>(0);

  const [nativeZoom, setNativeZoom] = useState(11);

  const [webViewState, setWebViewState] = useState({
    longitude: 106.8272,
    latitude: -6.1754,
    zoom: 11,
  });

  const themeColors = getThemeColor(colorScheme === 'dark');

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
    if (Platform.OS !== 'web') {
      setNativeZoom(11);
      cameraRef.current?.setCamera({
        centerCoordinate: [106.8272, -6.1754],
        zoomLevel: 11,
        animationDuration: 1000,
      });
    } else {
      setWebViewState({
        longitude: 106.8272,
        latitude: -6.1754,
        zoom: 11,
      });
    }
  };

  const handleZoomIn = () => {
    if (Platform.OS !== 'web') {
      const newZoom = Math.min(nativeZoom + 1, 18);
      setNativeZoom(newZoom);
      cameraRef.current?.setCamera({
        zoomLevel: newZoom,
        animationDuration: 300,
      });
    } else {
      setWebViewState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 1, 18) }));
    }
  };

  const handleZoomOut = () => {
    if (Platform.OS !== 'web') {
      const newZoom = Math.max(nativeZoom - 1, 3);
      setNativeZoom(newZoom);
      cameraRef.current?.setCamera({
        zoomLevel: newZoom,
        animationDuration: 300,
      });
    } else {
      setWebViewState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 1, 3) }));
    }
  };

  const handleReportSelect = useCallback((report: WeatherReport) => {
    lastMarkerSelectTimeRef.current = Date.now();
    setSelectedReport(report);
    if (Platform.OS !== 'web') {
      cameraRef.current?.setCamera({
        centerCoordinate: [report.lon, report.lat],
        animationDuration: 300,
      });
    } else {
      setWebViewState((prev) => ({
        ...prev,
        longitude: report.lon,
        latitude: report.lat,
      }));
    }
  }, []);

  const handleReportDeselect = useCallback(() => {
    if (Date.now() - lastMarkerSelectTimeRef.current < 500) {
      return;
    }
    setSelectedReport(null);
  }, []);

  const handleMapPress = useCallback(() => {
    if (Date.now() - lastMarkerSelectTimeRef.current < 1000) {
      return;
    }
    setSelectedReport(null);
  }, []);

  const handleMoveWeb = useCallback((evt: any) => {
    setWebViewState(evt.viewState);
  }, []);

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

  // Map View with Markers
  const renderMap = () => {
    if (isLoading) {
      return <MapSkeleton />;
    }

    if (mapError) {
      return <MapErrorState message={mapError} onRetry={handleRetry} />;
    }

    return (
      <View style={{ flex: 1 }}>
        <MapComponent
          filteredReports={filteredReports}
          selectedReport={selectedReport}
          onReportSelect={handleReportSelect}
          onReportDeselect={handleReportDeselect}
          webViewState={webViewState}
          onMoveWeb={handleMoveWeb}
          cameraRef={cameraRef}
          isDesktop={isDesktop}
          onMapPress={handleMapPress}
        />
      </View>
    );
  };

  return (
    <View className="flex-1">
      {isDesktop ? (
        <>
          <View className="relative flex-1">
            {renderMap()}
          {/* Desktop Map Panel - Minimal sidebar overlay */}
          <DesktopMapPanel
            onAddReport={() => setShowReportForm(true)}
          />

          {/* Map Controls (Desktop - Right Side) */}
          <View
            className="absolute right-6 top-24 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
            style={{
              zIndex: 10,
              shadowColor: themeColors.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8,
            }}>
            <Pressable
              onPress={handleZoomIn}
              className="h-11 w-11 items-center justify-center border-b border-border active:bg-muted/50">
              <Plus size={20} color={themeColors.icon.foreground} />
            </Pressable>

            <Pressable
              onPress={handleZoomOut}
              className="h-11 w-11 items-center justify-center border-b border-border active:bg-muted/50">
              <Minus size={20} color={themeColors.icon.foreground} />
            </Pressable>

            <Pressable
              onPress={handleLocationPress}
              className="h-11 w-11 items-center justify-center active:bg-muted/50">
              <MapPin size={18} color={themeColors.icon.foreground} />
            </Pressable>
          </View>

          {/* Report Form Dialog */}
          {showReportForm && (
            <ReportFormDialog
              location="Lokasi Terpilih"
              onSubmit={handleReportSubmit}
              onCancel={() => setShowReportForm(false)}
            />
          )}
        </View>
        
        {/* Bottom Sheet for Report Details (Desktop) - hoisted outside relative container */}
        {selectedReport && (
          <ReportBottomSheet report={selectedReport} onClose={() => setSelectedReport(null)} />
        )}
      </>
      ) : (
        <>
          {renderMap()}

          {/* Mobile Overlays wrapped in pointerEvents="box-none" container */}
          <View pointerEvents="box-none" className="absolute inset-0">
            {/* Collapsible Search */}
            <CollapsibleSearch placeholder="Cari lokasi..." style={{ top: insets.top + 12 }} />

            {/* Map Controls (Mobile - Right Side) */}
            <View
              className="absolute right-4 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
              style={{
                bottom: insets.bottom + 96,
                zIndex: 10,
                shadowColor: themeColors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8,
              }}>
              <Pressable
                onPress={handleZoomIn}
                className="h-12 w-12 items-center justify-center border-b border-border active:bg-muted/50">
                <Plus size={20} color={themeColors.icon.foreground} />
              </Pressable>

              <Pressable
                onPress={handleZoomOut}
                className="h-12 w-12 items-center justify-center border-b border-border active:bg-muted/50">
                <Minus size={20} color={themeColors.icon.foreground} />
              </Pressable>

              <Pressable
                onPress={handleLocationPress}
                className="h-12 w-12 items-center justify-center active:bg-muted/50">
                <MapPin size={18} color={themeColors.icon.foreground} />
              </Pressable>
            </View>

            {/* Floating Action Button (Mobile) */}
            <Pressable
              onPress={() => setShowReportForm(true)}
              className="absolute right-6 h-16 w-16 items-center justify-center rounded-full shadow-xl active:scale-95 border bg-card border-border"
              style={{
                bottom: insets.bottom + 24,
                zIndex: 10,
                shadowColor: themeColors.shadow,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 10,
              }}
              accessibilityLabel="Laporkan Cuaca"
              accessibilityRole="button">
              <Plus size={28} color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : themeColors.icon.foreground} />
            </Pressable>
          </View>

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
