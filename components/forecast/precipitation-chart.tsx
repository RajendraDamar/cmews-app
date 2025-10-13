import React from 'react';
import { ChartKitPrecipitationChart } from '~/components/charts';

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data: PrecipitationChartData[];
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  return <ChartKitPrecipitationChart data={data} />;
}
