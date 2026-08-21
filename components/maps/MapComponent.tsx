import { SeverityMarker } from '~/components/maps/severity-marker';
import { WeatherReport } from '~/lib/types/weather-report';
import { MAP_STYLES } from '~/lib/constants';
import { useTheme } from '~/lib/theme-provider';

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
}

export default function MapComponent({
  filteredReports,
  selectedReport,
  onReportSelect,
  onReportDeselect,
  cameraRef,
  isDesktop = false,
  onMapPress,
}: NativeMapComponentProps) {
  const { colorScheme } = useTheme();
  const mapStyle = colorScheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light;

  if (!MapLibreGL) {
    return null;
  }

  return (
    <MapLibreGL.MapView
      style={{ flex: 1 }}
      mapStyle={mapStyle}
      styleURL={mapStyle}
      logoEnabled={false}
      attributionEnabled={false}
      compassEnabled={!isDesktop}
      compassViewMargins={{ x: 16, y: 100 }}
      rotateEnabled={true}
      pitchEnabled={true}
      onPress={(feature: any) => {
        if (feature?.geometry?.coordinates && onMapPress) {
          onMapPress(feature.geometry.coordinates as [number, number]);
        }
      }}>
      <MapLibreGL.Camera
        ref={cameraRef}
        defaultSettings={{
          centerCoordinate: [106.8272, -6.1754],
          zoomLevel: 11,
        }}
      />

      {filteredReports.map((report) => (
        <MapLibreGL.PointAnnotation
          key={report.id}
          id={report.id}
          coordinate={[report.lon, report.lat]}
          anchor={{ x: 0.5, y: 0.5 }}
          onSelected={() => onReportSelect(report)}>
          <SeverityMarker
            report={report}
            onPress={() => onReportSelect(report)}
            selected={selectedReport?.id === report.id}
          />
        </MapLibreGL.PointAnnotation>
      ))}
    </MapLibreGL.MapView>
  );
}
