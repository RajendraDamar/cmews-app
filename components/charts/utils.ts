import { Skia, SkPath } from '@shopify/react-native-skia';
import { scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';

export interface DataPoint {
  x: number | Date;
  y: number;
}

/**
 * Create a smooth path from data points using d3-shape
 */
export function createSmoothPath(
  data: DataPoint[],
  width: number,
  height: number,
  padding = { top: 20, right: 20, bottom: 30, left: 40 }
): SkPath {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find data ranges
  const xValues = data.map((d) => (d.x instanceof Date ? d.x.getTime() : d.x));
  const yValues = data.map((d) => d.y);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // Add some padding to y-axis
  const yPadding = (yMax - yMin) * 0.1;

  // Create scales
  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([padding.left, padding.left + chartWidth]);

  const yScale = scaleLinear()
    .domain([yMin - yPadding, yMax + yPadding])
    .range([padding.top + chartHeight, padding.top]);

  // Create line generator
  const lineGenerator = line<DataPoint>()
    .x((d) => xScale(d.x instanceof Date ? d.x.getTime() : d.x))
    .y((d) => yScale(d.y))
    .curve(curveMonotoneX);

  const pathString = lineGenerator(data) || '';

  // Convert SVG path string to Skia path
  const path = Skia.Path.MakeFromSVGString(pathString);
  return path || Skia.Path.Make();
}

/**
 * Create a bar chart path
 */
export function createBarPath(
  value: number,
  index: number,
  maxValue: number,
  barWidth: number,
  height: number,
  spacing: number,
  padding = { top: 20, bottom: 30 }
): SkPath {
  const chartHeight = height - padding.top - padding.bottom;
  const barHeight = (value / maxValue) * chartHeight;
  const x = spacing + index * (barWidth + spacing);
  const y = padding.top + chartHeight - barHeight;

  const path = Skia.Path.Make();
  const rect = Skia.XYWHRect(x, y, barWidth, barHeight);
  path.addRect(rect);

  return path;
}

/**
 * Create an area path (for gradient fills)
 */
export function createAreaPath(
  data: DataPoint[],
  width: number,
  height: number,
  padding = { top: 20, right: 20, bottom: 30, left: 40 }
): SkPath {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xValues = data.map((d) => (d.x instanceof Date ? d.x.getTime() : d.x));
  const yValues = data.map((d) => d.y);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const yPadding = (yMax - yMin) * 0.1;

  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([padding.left, padding.left + chartWidth]);

  const yScale = scaleLinear()
    .domain([yMin - yPadding, yMax + yPadding])
    .range([padding.top + chartHeight, padding.top]);

  const path = Skia.Path.Make();
  const bottom = padding.top + chartHeight;

  // Start from bottom-left
  path.moveTo(xScale(xValues[0]), bottom);

  // Draw line to first point
  path.lineTo(xScale(xValues[0]), yScale(yValues[0]));

  // Draw the curve through all points
  for (let i = 1; i < data.length; i++) {
    const x = xScale(xValues[i]);
    const y = yScale(yValues[i]);
    path.lineTo(x, y);
  }

  // Close the path at the bottom
  path.lineTo(xScale(xValues[xValues.length - 1]), bottom);
  path.close();

  return path;
}

/**
 * Format values for display
 */
export function formatValue(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

/**
 * Calculate chart dimensions based on container
 */
export function getChartDimensions(
  containerWidth: number,
  containerHeight: number,
  padding = { top: 20, right: 20, bottom: 30, left: 40 }
) {
  return {
    width: containerWidth,
    height: containerHeight,
    chartWidth: containerWidth - padding.left - padding.right,
    chartHeight: containerHeight - padding.top - padding.bottom,
    padding,
  };
}
