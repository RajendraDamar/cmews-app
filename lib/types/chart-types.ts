/**
 * Comprehensive TypeScript interfaces for chart components
 * Provides type safety and IntelliSense support for weather chart data structures
 */

/**
 * Represents a single chart data point with various meteorological measurements
 * For rendering weather charts and visualizations
 */
export interface ChartWeatherDataPoint {
  /** ISO timestamp or formatted time string */
  timestamp: string;
  /** Temperature in Celsius */
  temperature: number;
  /** Relative humidity percentage (0-100) */
  humidity: number;
  /** Rainfall amount in millimeters */
  rainfall: number;
  /** Wind speed in km/h or m/s depending on context */
  windSpeed: number;
  /** Wind direction in degrees (0-360) or cardinal direction string */
  windDirection: number;
  /** Optional wave height in meters for maritime data */
  waveHeight?: number;
}

/**
 * Represents a point on a chart with coordinates and metadata
 */
export interface ChartPoint {
  /** X-axis coordinate */
  x: number;
  /** Y-axis coordinate */
  y: number;
  /** The actual data value at this point */
  value: number;
  /** Optional label for the point */
  label?: string;
  /** Optional color for the point */
  color?: string;
}

/**
 * Defines the boundaries and dimensions of a chart canvas
 */
export interface ChartBounds {
  /** Total width of the chart */
  width: number;
  /** Total height of the chart */
  height: number;
  /** Left padding/margin */
  left: number;
  /** Top padding/margin */
  top: number;
  /** Right padding/margin */
  right: number;
  /** Bottom padding/margin */
  bottom: number;
}

/**
 * Configuration options for chart appearance and behavior
 */
export interface ChartConfig {
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Whether to show axis labels */
  showLabels?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Primary line color */
  lineColor?: string;
  /** Fill/area color */
  fillColor?: string;
}

/**
 * Base props for all chart components
 */
export interface ChartProps {
  /** Array of weather data points to display */
  data: ChartWeatherDataPoint[];
  /** Chart width in pixels */
  width?: number;
  /** Chart height in pixels */
  height?: number;
  /** Chart configuration options */
  config?: ChartConfig;
}

/**
 * Props specific to wind chart components
 */
export interface WindChartProps extends ChartProps {
  /** Whether to display wind compass */
  showCompass?: boolean;
  /** Size of the compass in pixels */
  compassSize?: number;
}

/**
 * Props specific to wave chart components
 */
export interface WaveChartProps extends ChartProps {
  /** Color scale for wave heights */
  waveColorScale?: string[];
  /** Whether to show tide information */
  showTideInfo?: boolean;
}

/**
 * Props specific to precipitation chart components
 */
export interface PrecipitationChartProps extends ChartProps {
  /** Width of bars in bar chart */
  barWidth?: number;
  /** Whether to show accumulated precipitation */
  showAccumulation?: boolean;
}
