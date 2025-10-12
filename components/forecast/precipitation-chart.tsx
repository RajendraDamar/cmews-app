import React from 'react';
import { View, Platform } from 'react-native';
import { Text } from '~/components/ui/text';
import { SkiaPrecipitationChart } from '~/components/charts';

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

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data: PrecipitationChartData[];
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  // Use high-performance Skia chart implementation
  return <SkiaPrecipitationChart data={data} />;
}
