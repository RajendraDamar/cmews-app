import { View, Platform, Pressable, ScrollView } from 'react-native';
import { useState, useRef } from 'react';
import { SearchAutocomplete } from '~/components/maps/search-autocomplete';
import { PlaceCard } from '~/components/maps/place-card';
import { DirectionsPanel } from '~/components/maps/directions-panel';
import { CategoryFilter } from '~/components/maps/category-filter';
import { LayerSwitcher } from '~/components/maps/layer-switcher';
import { SavedPlacesDrawer } from '~/components/maps/saved-places-drawer';
import { BottomSheet } from '~/components/maps/bottom-sheet';
import { MapMarker } from '~/components/maps/map-marker';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Plus, Minus, Navigation, Maximize, Star, Route as RouteIcon } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { useBreakpoint } from '~/lib/breakpoints';
import { MOCK_MAP_PLACES } from '~/constants/mock-data';

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
  const { colorScheme } = useTheme();
  const { isTablet, isDesktop } = useBreakpoint();
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showSavedPlaces, setShowSavedPlaces] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [layers, setLayers] = useState({
    traffic: false,
    transit: false,
    bicycle: false,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place);
    if (Platform.OS !== 'web' && cameraRef.current && place.lat && place.lon) {
      cameraRef.current.setCamera({
        centerCoordinate: [place.lon, place.lat],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    }
  };

  const handleDirections = () => {
    setShowDirections(true);
  };

  const handleLayerToggle = (layer: 'traffic' | 'transit' | 'bicycle') => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const filteredPlaces = selectedCategory
    ? MOCK_MAP_PLACES.filter((p) => p.category === selectedCategory)
    : MOCK_MAP_PLACES;

  const iconColor = colorScheme === 'dark' ? '#e5e7eb' : '#1f2937';

  // Desktop Sidebar
  const renderDesktopSidebar = () => (
    <View className="w-[30%] border-r border-border bg-card">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View className="border-b border-border p-4">
          <SearchAutocomplete onPlaceSelect={handlePlaceSelect} />
        </View>

        {/* Quick Actions */}
        <View className="border-b border-border p-4">
          <View className="flex-row gap-2">
            <Button
              label="Directions"
              variant="outline"
              className="flex-1"
              onPress={() => setShowDirections(true)}>
              <RouteIcon size={16} color={iconColor} />
            </Button>
            <Button
              label="Saved"
              variant="outline"
              className="flex-1"
              onPress={() => setShowSavedPlaces(true)}>
              <Star size={16} color={iconColor} />
            </Button>
          </View>
        </View>

        {/* Place Details or Directions Panel */}
        {showDirections ? (
          <DirectionsPanel
            origin="Your location"
            destination={selectedPlace?.name}
            onClose={() => setShowDirections(false)}
          />
        ) : showSavedPlaces ? (
          <SavedPlacesDrawer
            onPlaceSelect={handlePlaceSelect}
            onClose={() => setShowSavedPlaces(false)}
          />
        ) : selectedPlace ? (
          <View className="p-4">
            <PlaceCard place={selectedPlace} onDirections={handleDirections} />
          </View>
        ) : (
          <View className="p-6">
            <Text variant="muted" className="text-center">
              Search for a place or select a marker on the map
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  // Map View with Markers
  const renderMap = () => (
    <View className="flex-1">
      {Platform.OS === 'web' ? (
        <WebMap />
      ) : MapLibreGL ? (
        <MapLibreGL.MapView
          style={{ flex: 1 }}
          styleURL={
            mapType === 'satellite'
              ? 'https://demotiles.maplibre.org/style.json'
              : mapType === 'terrain'
                ? 'https://demotiles.maplibre.org/style.json'
                : 'https://demotiles.maplibre.org/style.json'
          }
          logoEnabled={false}
          attributionEnabled={false}
          compassEnabled={!isDesktop}
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
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            />
          </MapLibreGL.MarkerView>

          {/* Place Markers */}
          {filteredPlaces.map((place) => (
            <MapLibreGL.MarkerView key={place.id} coordinate={[place.lon, place.lat]}>
              <Pressable onPress={() => handlePlaceSelect(place)}>
                <MapMarker
                  category={place.category || 'landmark'}
                  selected={selectedPlace?.id === place.id}
                />
              </Pressable>
            </MapLibreGL.MarkerView>
          ))}
        </MapLibreGL.MapView>
      ) : (
        <View className="flex-1 items-center justify-center bg-muted">
          <Text variant="muted" size="xl">
            Map unavailable
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1">
      {isDesktop ? (
        <View className="flex-1 flex-row">
          {renderDesktopSidebar()}
          <View className="flex-[0.7]">{renderMap()}</View>
        </View>
      ) : (
        <>
          {renderMap()}

          {/* Mobile/Tablet Overlays */}
          {/* Search Bar */}
          <View
            className={`absolute left-4 right-4 top-4 ${isTablet ? 'w-96 self-center' : ''}`}
            style={{ zIndex: 10 }}>
            <SearchAutocomplete onPlaceSelect={handlePlaceSelect} />
          </View>

          {/* Category Filter */}
          <View className="absolute left-0 right-0 top-20" style={{ zIndex: 9 }}>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </View>

          {/* Map Controls (Right Side) */}
          {Platform.OS !== 'web' && MapLibreGL && (
            <View className="absolute bottom-32 right-4 gap-2" style={{ zIndex: 10 }}>
              <LayerSwitcher
                mapType={mapType}
                onMapTypeChange={setMapType}
                layers={layers}
                onLayerToggle={handleLayerToggle}
              />

              <Pressable
                onPress={handleZoomIn}
                className="h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg active:opacity-70">
                <Plus size={24} color={iconColor} />
              </Pressable>

              <Pressable
                onPress={handleZoomOut}
                className="h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg active:opacity-70">
                <Minus size={24} color={iconColor} />
              </Pressable>

              <Pressable
                onPress={() => setIsFullscreen(!isFullscreen)}
                className="h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg active:opacity-70">
                <Maximize size={20} color={iconColor} />
              </Pressable>
            </View>
          )}

          {/* Location FAB */}
          <Pressable
            onPress={handleLocationPress}
            className="absolute bottom-32 left-4 h-14 w-14 items-center justify-center rounded-full bg-card shadow-lg active:opacity-70"
            style={{ zIndex: 10 }}>
            <Navigation size={24} color={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} />
          </Pressable>

          {/* Bottom Action Buttons */}
          <View className="absolute bottom-4 left-4 right-4 flex-row gap-2" style={{ zIndex: 10 }}>
            <Button
              label="Directions"
              variant="outline"
              className="flex-1 bg-card"
              onPress={() => setShowDirections(true)}>
              <RouteIcon size={16} color={iconColor} />
            </Button>
            <Button
              label="Saved Places"
              variant="outline"
              className="flex-1 bg-card"
              onPress={() => setShowSavedPlaces(true)}>
              <Star size={16} color={iconColor} />
            </Button>
          </View>

          {/* Bottom Sheet for Place Details (Mobile) */}
          {selectedPlace && !showDirections && (
            <BottomSheet
              isOpen={!!selectedPlace}
              onClose={() => setSelectedPlace(null)}
              snapPoints={[0.4, 0.7]}
              initialSnap={0}>
              <View className="px-4">
                <PlaceCard place={selectedPlace} onDirections={handleDirections} />
              </View>
            </BottomSheet>
          )}

          {/* Bottom Sheet for Directions (Mobile) */}
          {showDirections && (
            <BottomSheet
              isOpen={showDirections}
              onClose={() => setShowDirections(false)}
              snapPoints={[0.5, 0.9]}
              initialSnap={1}>
              <DirectionsPanel
                origin="Your location"
                destination={selectedPlace?.name}
                onClose={() => setShowDirections(false)}
              />
            </BottomSheet>
          )}

          {/* Bottom Sheet for Saved Places (Mobile) */}
          {showSavedPlaces && (
            <BottomSheet
              isOpen={showSavedPlaces}
              onClose={() => setShowSavedPlaces(false)}
              snapPoints={[0.6, 0.9]}
              initialSnap={0}>
              <SavedPlacesDrawer
                onPlaceSelect={handlePlaceSelect}
                onClose={() => setShowSavedPlaces(false)}
              />
            </BottomSheet>
          )}
        </>
      )}
    </View>
  );
}
