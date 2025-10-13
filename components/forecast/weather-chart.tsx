import { ChartKitTemperatureChart } from '~/components/charts';

interface ChartDataPoint {
  time: string;
  temp: number;
  humidity: number;
}

interface WeatherChartProps {
  data: ChartDataPoint[];
}

export function WeatherChart({ data }: WeatherChartProps) {
  return <ChartKitTemperatureChart data={data} />;
}
