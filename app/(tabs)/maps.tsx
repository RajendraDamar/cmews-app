import { Stack } from 'expo-router';
import { View, useWindowDimensions, Platform } from 'react-native';
import { useState } from 'react';
import { SearchBar } from '~/components/maps/search-bar';
import { PlaceCard } from '~/components/maps/place-card';
import { Text } from '~/components/ui/text';

// Conditionally import MapLibre only on native platforms
let MapLibreGL: any = null;
if (Platform.OS !== 'web') {
  try {
    MapLibreGL = require('@maplibre/maplibre-react-native').default;
    MapLibreGL?.setAccessToken?.(null);
  } catch (error) {
    console.error('Failed to load MapLibre:', error);
  }
}

export default function MapsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  return (
    <>
      <Stack.Screen options={{ title: 'Maps' }} />
      <View className="flex-1">
        {Platform.OS === 'web' ? (
          <View className="flex-1 items-center justify-center bg-muted">
            <Text variant="muted" size="xl">
              Map view is available on native platforms
            </Text>
          </View>
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
