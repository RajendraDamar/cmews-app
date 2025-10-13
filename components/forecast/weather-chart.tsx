import { SkiaTemperatureChart, SmartChartWrapper } from '~/components/charts';

interface ChartDataPoint {
  time: string;
  temp: number;
  humidity: number;
}

interface WeatherChartProps {
  data: ChartDataPoint[];
}

export function WeatherChart({ data }: WeatherChartProps) {
  return (
    <SmartChartWrapper height={220} loadingMessage="Memuat grafik cuaca...">
      <SkiaTemperatureChart data={data} />
    </SmartChartWrapper>
  );
}
