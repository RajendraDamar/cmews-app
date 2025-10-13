import React from 'react';
import { ChartKitTemperatureChart } from '~/components/charts';

interface TemperatureChartData {
  time: string;
  temp: number;
  humidity: number;
}

interface TemperatureChartProps {
  data: TemperatureChartData[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  return <ChartKitTemperatureChart data={data} />;
}
