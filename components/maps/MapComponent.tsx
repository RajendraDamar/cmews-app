import { View, Text, Pressable } from 'react-native';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SeverityMarker } from '~/components/maps/severity-marker';
import { WeatherReport } from '~/lib/types/weather-report';
import { MAP_STYLES } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';
import Supercluster from 'supercluster';
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
}: NativeMapComponentProps) {
  const { colorScheme } = useTheme();
  const mapStyle = colorScheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light;

  // Track map region state for clustering
  const [region, setRegion] = useState({
    zoom: 11,
    bounds: [106.5, -6.5, 107.0, -6.0], // West, South, East, North
  });

  const mapRef = useRef<any>(null);
  const lastGestureTimeRef = useRef<number>(0);

  // Initialize Supercluster
  const supercluster = useMemo(() => {
    const sc = new Supercluster({
      radius: 40,
      maxZoom: 14,
    });
    
    // Map reports to GeoJSON for supercluster
    const points = filteredReports.map(report => ({
      type: 'Feature' as const,
      properties: { cluster: false, reportId: report.id, report },
      geometry: { type: 'Point' as const, coordinates: [report.lon, report.lat] }
    }));
    
    sc.load(points as any);
    return sc;
  }, [filteredReports]);

  // Get clusters based on current map state
  const clusters = useMemo(() => {
    return supercluster.getClusters(
      region.bounds as [number, number, number, number],
      Math.round(region.zoom)
    );
  }, [region, supercluster]);

  const handleRegionDidChange = useCallback(async (feature: any) => {
    lastGestureTimeRef.current = Date.now();
    
    if (mapRef.current) {
      const zoom = await mapRef.current.getZoom();
      const boundsArr = await mapRef.current.getVisibleBounds();
      // boundsArr is [[neLng, neLat], [swLng, swLat]]
      // supercluster needs [westLng, southLat, eastLng, northLat]
      if (boundsArr && boundsArr.length === 2) {
        const ne = boundsArr[0];
        const sw = boundsArr[1];
        setRegion({
          zoom,
          bounds: [sw[0], sw[1], ne[0], ne[1]]
        });
      }
      if (onZoomChange) {
        onZoomChange(Math.round(zoom));
      }
    }
  }, [onZoomChange]);

  const handleClusterPress = useCallback((clusterId: number, coordinates: [number, number]) => {
    if (cameraRef?.current) {
      const expansionZoom = supercluster.getClusterExpansionZoom(clusterId);
      cameraRef.current.setCamera({
        centerCoordinate: coordinates,
        zoomLevel: Math.min(expansionZoom, 16),
        animationDuration: 400,
        animationMode: 'flyTo',
      });
    }
  }, [cameraRef, supercluster]);

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
      compassEnabled={!isDesktop}
      compassViewMargins={{ x: 16, y: 100 }}
      rotateEnabled={true}
      pitchEnabled={true}
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
          centerCoordinate: [106.8272, -6.1754],
          zoomLevel: 11,
        }}
      />

      <MapLibreGL.PointAnnotation
        key="user-location-pulsing"
        id="user-location-pulsing"
        coordinate={[106.8272, -6.1754]}
        anchor={{ x: 0.5, y: 0.5 }}>
        <PulsingUserLocation />
      </MapLibreGL.PointAnnotation>

      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount, report } = cluster.properties as any;
        const key = isCluster ? `cluster-${cluster.id}` : `report-${report.id}`;

        if (isCluster) {
          return (
            <MapLibreGL.PointAnnotation
              key={key}
              id={key}
              coordinate={[longitude, latitude]}
              anchor={{ x: 0.5, y: 0.5 }}
              onSelected={() => handleClusterPress(cluster.id as number, [longitude, latitude])}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#3b82f6',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                  {pointCount}
                </Text>
              </View>
            </MapLibreGL.PointAnnotation>
          );
        }

        return (
          <MapLibreGL.PointAnnotation
            key={key}
            id={key}
            coordinate={[longitude, latitude]}
            anchor={{ x: 0.5, y: 0.5 }}
            onSelected={() => onReportSelect(report)}>
            <SeverityMarker
              report={report}
              onPress={() => onReportSelect(report)}
              selected={selectedReport?.id === report.id}
            />
          </MapLibreGL.PointAnnotation>
        );
      })}
    </MapLibreGL.MapView>
  );
}
