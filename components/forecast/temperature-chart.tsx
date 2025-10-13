import React from 'react';
import { SkiaTemperatureChart, SmartChartWrapper } from '~/components/charts';

interface TemperatureChartData {
  time: string;
  temp: number;
  humidity: number;
}

interface TemperatureChartProps {
  data: TemperatureChartData[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  return (
    <SmartChartWrapper height={220} loadingMessage="Memuat grafik suhu...">
      <SkiaTemperatureChart data={data} />
    </SmartChartWrapper>
  );
}
