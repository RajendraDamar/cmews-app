import React from 'react';
import { SkiaPrecipitationChart, SmartChartWrapper } from '~/components/charts';

interface PrecipitationChartData {
  time: string;
  precipitation: number;
}

interface PrecipitationChartProps {
  data: PrecipitationChartData[];
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  return (
    <SmartChartWrapper height={220} loadingMessage="Memuat grafik curah hujan...">
      <SkiaPrecipitationChart data={data} />
    </SmartChartWrapper>
  );
}
