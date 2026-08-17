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
  cameraRef?: any;
  isDesktop?: boolean;
  webViewState?: { longitude: number; latitude: number; zoom: number };
  onMoveWeb?: (evt: any) => void;
}

export default function MapComponent({
  filteredReports,
  selectedReport,
  onReportSelect,
  cameraRef,
  isDesktop = false,
}: NativeMapComponentProps) {
  const { colorScheme } = useTheme();
  const mapStyle = colorScheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light;

  if (!MapLibreGL) {
    return null;
  }

  return (
    <MapLibreGL.MapView
      style={{ flex: 1 }}
      styleURL={mapStyle}
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

      {filteredReports.map((report) => (
        <MapLibreGL.MarkerView
          key={report.id}
          coordinate={[report.lon, report.lat]}
          anchor={{ x: 0.5, y: 0.5 }}>
          <SeverityMarker
            report={report}
            onPress={() => onReportSelect(report)}
            selected={selectedReport?.id === report.id}
          />
        </MapLibreGL.MarkerView>
      ))}
    </MapLibreGL.MapView>
  );
}
