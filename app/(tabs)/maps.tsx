import { Stack } from 'expo-router';
import { View, useWindowDimensions, Platform, Pressable } from 'react-native';
import { useState } from 'react';
import { SearchBar } from '~/components/maps/search-bar';
import { PlaceCard } from '~/components/maps/place-card';
import { Text } from '~/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

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
    />
  );
}

export default function MapsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const handleLocationPress = () => {
    // TODO: Implement geolocation
    console.log('Get current location');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Maps' }} />
      <View className="flex-1">
        {Platform.OS === 'web' ? (
          <WebMap />
        ) : MapLibreGL ? (
          <MapLibreGL.MapView
            style={{ flex: 1 }}
            styleURL="https://demotiles.maplibre.org/style.json"
            logoEnabled={false}
            attributionEnabled={false}>
            <MapLibreGL.Camera zoomLevel={12} centerCoordinate={[-74.006, 40.7128]} />
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

        {/* Location FAB */}
        <Pressable
          onPress={handleLocationPress}
          className={`absolute ${isDesktop ? 'right-4' : 'right-4'} ${selectedPlace ? 'bottom-48' : 'bottom-4'} h-14 w-14 items-center justify-center rounded-full bg-card shadow-lg active:opacity-70`}
          style={{ zIndex: 10 }}>
          <Ionicons name="locate" size={24} color="#666" />
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
    </>
  );
}
