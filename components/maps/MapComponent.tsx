import { View } from 'react-native';
import React, { useCallback, useRef } from 'react';
import { SeverityMarker } from '~/components/maps/severity-marker';
import { WeatherReport } from '~/lib/types/weather-report';
import { MAP_STYLES } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

let MapLibreGL: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  MapLibreGL = require('@maplibre/maplibre-react-native').default;
  MapLibreGL?.setAccessToken?.(null);
} catch (error) {
  console.error('Failed to load MapLibre Native:', error);
}

interface NativeMapComponentProps {
  filteredReports: WeatherReport[];
  selectedReport: WeatherReport | null;
  onReportSelect: (report: WeatherReport) => void;
  onReportDeselect?: () => void;
  cameraRef?: any;
  isDesktop?: boolean;
  webViewState?: { longitude: number; latitude: number; zoom: number };
  onMoveWeb?: (evt: any) => void;
  onMapPress?: (coords: [number, number]) => void;
  onZoomChange?: (zoom: number) => void;
  currentZoom?: number;
  userLocation?: { latitude: number; longitude: number } | null;
}

// User Location Pulse Component
const PulsingUserLocation = () => (
  <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#3b82f6', borderWidth: 3, borderColor: 'white', zIndex: 2 }} />
    <Animated.View
      entering={FadeIn.duration(1000).delay(200)}
      exiting={FadeOut}
      style={{
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(59, 130, 246, 0.25)',
      }}
    />
  </View>
);

export default function MapComponent({
  filteredReports,
  selectedReport,
  onReportSelect,
  onReportDeselect,
  cameraRef,
  isDesktop = false,
  onMapPress,
  onZoomChange,
  currentZoom = 11,
  userLocation,
}: NativeMapComponentProps) {
  const { colorScheme } = useTheme();
  const mapStyle = colorScheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light;

  const mapRef = useRef<any>(null);
  const lastGestureTimeRef = useRef<number>(0);

  const handleRegionDidChange = useCallback((feature: any) => {
    lastGestureTimeRef.current = Date.now();
    
    if (feature?.properties?.zoomLevel !== undefined && onZoomChange) {
      const newZoom = Math.round(feature.properties.zoomLevel);
      console.log('MapLibre Android Zoom changed to:', newZoom);
      onZoomChange(newZoom);
    }
  }, [onZoomChange]);

  if (!MapLibreGL) {
    return null;
  }

  return (
    <MapLibreGL.MapView
      ref={mapRef}
      style={{ flex: 1 }}
      mapStyle={mapStyle}
      styleURL={mapStyle}
      logoEnabled={false}
      attributionEnabled={false}
      compassEnabled={false}
      compassViewMargins={{ x: 16, y: 100 }}
      rotateEnabled={false}
      pitchEnabled={false}
      scrollEnabled={true}
      zoomEnabled={true}
      onRegionDidChange={handleRegionDidChange}
      onPress={(feature: any) => {
        if (feature?.geometry?.coordinates && onMapPress) {
          onMapPress(feature.geometry.coordinates as [number, number]);
        }
      }}>
      
      <MapLibreGL.Camera
        ref={cameraRef}
        followUserLocation={false}
        defaultSettings={{
          centerCoordinate: userLocation ? [userLocation.longitude, userLocation.latitude] : [106.8272, -6.1754],
          zoomLevel: 11,
        }}
      />

      {userLocation && (
        <MapLibreGL.PointAnnotation
          key="user-location-pulsing"
          id="user-location-pulsing"
          coordinate={[userLocation.longitude, userLocation.latitude]}
          anchor={{ x: 0.5, y: 0.5 }}>
          <PulsingUserLocation />
        </MapLibreGL.PointAnnotation>
      )}

      {filteredReports.map((report) => {
        // MapLibre PointAnnotation caches the initial render on Android.
        // We append the zoom bucket and selection state to the key to force a fresh remount when the size should change.
        const zoomBucket = currentZoom < 7 ? 'dot' : currentZoom < 10 ? 'medium' : 'full';
        const isSelected = selectedReport?.id === report.id;
        const key = `report-${report.id}-${zoomBucket}-${isSelected}`;

        return (
          <MapLibreGL.PointAnnotation
            key={key}
            id={key}
            coordinate={[report.lon, report.lat]}
            anchor={{ x: 0.5, y: 0.5 }}
            onSelected={() => onReportSelect(report)}>
            <SeverityMarker
              report={report}
              selected={selectedReport?.id === report.id}
              zoom={currentZoom}
            />
          </MapLibreGL.PointAnnotation>
        );
      })}
    </MapLibreGL.MapView>
  );
}
