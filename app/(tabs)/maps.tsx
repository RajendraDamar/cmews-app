import { View, useWindowDimensions, Platform, Pressable } from 'react-native';
import { useState, useRef } from 'react';
import { SearchBar } from '~/components/maps/search-bar';
import { PlaceCard } from '~/components/maps/place-card';
import { Text } from '~/components/ui/text';
import { Plus, Minus, Navigation } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

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
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 12,
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
    <MapGL
      {...viewState}
      onMove={(evt: any) => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://demotiles.maplibre.org/style.json"
      dragRotate={true}
      pitchWithRotate={true}
    />
  );
}

export default function MapsScreen() {
  const { width } = useWindowDimensions();
  const { colorScheme } = useTheme();
  const isDesktop = width >= 1024;
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const cameraRef = useRef<any>(null);

  const handleLocationPress = () => {
    // Center to default location (New York)
    if (Platform.OS !== 'web' && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [-74.006, 40.7128],
        zoomLevel: 12,
        animationDuration: 1000,
      });
    }
    console.log('Get current location');
  };

  const handleZoomIn = () => {
    if (Platform.OS !== 'web' && cameraRef.current) {
      cameraRef.current.zoomTo(15, 500);
    }
  };

  const handleZoomOut = () => {
    if (Platform.OS !== 'web' && cameraRef.current) {
      cameraRef.current.zoomTo(10, 500);
    }
  };

  return (
    <View className="flex-1">
      {Platform.OS === 'web' ? (
        <WebMap />
      ) : MapLibreGL ? (
        <MapLibreGL.MapView
          style={{ flex: 1 }}
          styleURL="https://demotiles.maplibre.org/style.json"
          logoEnabled={false}
          attributionEnabled={false}
          compassEnabled={true}
          compassViewMargins={{ x: 16, y: 100 }}
          rotateEnabled={true}
          pitchEnabled={true}>
          <MapLibreGL.Camera
            ref={cameraRef}
            zoomLevel={12}
            centerCoordinate={[-74.006, 40.7128]}
            animationMode="flyTo"
            animationDuration={1000}
          />

          {/* User Location Marker */}
          <MapLibreGL.MarkerView coordinate={[-74.006, 40.7128]}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: colorScheme === 'dark' ? '#60a5fa' : '#3b82f6',
                borderWidth: 3,
                borderColor: '#fff',
              }}
            />
          </MapLibreGL.MarkerView>
        </MapLibreGL.MapView>
      ) : (
        <View className="flex-1 items-center justify-center bg-muted">
          <Text variant="muted" size="xl">
            Map unavailable
          </Text>
        </View>
      )}

      {/* Search Overlay */}
      <View
        className={`absolute top-4 ${isDesktop ? 'left-4 w-96' : 'left-4 right-4'}`}
        style={{ zIndex: 10 }}>
        <SearchBar onPlaceSelect={setSelectedPlace} />
      </View>

      {/* Map Controls */}
      {Platform.OS !== 'web' && MapLibreGL && (
        <View
          className={`absolute ${isDesktop ? 'right-4' : 'right-4'} top-24`}
          style={{ zIndex: 10 }}>
          <Pressable
            onPress={handleZoomIn}
            className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg active:opacity-70">
            <Plus size={24} color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)'} />
          </Pressable>
          <Pressable
            onPress={handleZoomOut}
            className="h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg active:opacity-70">
            <Minus size={24} color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)'} />
          </Pressable>
        </View>
      )}

      {/* Location FAB */}
      <Pressable
        onPress={handleLocationPress}
        className={`absolute ${isDesktop ? 'right-4' : 'right-4'} ${selectedPlace ? 'bottom-48' : 'bottom-4'} h-14 w-14 items-center justify-center rounded-full bg-card shadow-lg active:opacity-70`}
        style={{ zIndex: 10 }}>
        <Navigation size={24} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
      </Pressable>

      {/* Place Card */}
      {selectedPlace && (
        <View
          className={`absolute bottom-4 ${isDesktop ? 'left-4 w-96' : 'left-4 right-4'}`}
          style={{ zIndex: 10 }}>
          <PlaceCard place={selectedPlace} />
        </View>
      )}
    </View>
  );
}
