import React from 'react';
import { View, Platform } from 'react-native';
import { Text } from '~/components/ui/text';
import { SkiaTemperatureChart } from '~/components/charts';

// ECharts for cross-platform support (fallback)
let EChartsComponent: any;
if (Platform.OS !== 'web') {
  try {
    const EChartsModule = require('react-native-echarts-wrapper');
    EChartsComponent = EChartsModule.default;
  } catch (e) {
    // ECharts not available
    console.warn('ECharts not available:', e);
  }
}

interface TemperatureChartData {
  time: string;
  temp: number;
  humidity: number;
}

interface TemperatureChartProps {
  data: TemperatureChartData[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  // Use high-performance Skia chart implementation
  return <SkiaTemperatureChart data={data} />;
}
