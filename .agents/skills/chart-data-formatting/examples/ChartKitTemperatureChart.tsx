// Example component implementation for chart-data-formatting skill
// Path: components/charts/ChartKitTemperatureChart.tsx

import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export const ChartKitTemperatureChart = ({ weatherData }: { weatherData: any }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!weatherData) return;

    // Take first 24 hours (8 forecasts) for temperature chart
    const next24Hours = weatherData.dailyForecasts?.[0] || [];

    const formatted = {
      labels: next24Hours.map((item: any) =>
        new Date(item.datetime).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        })
      ),
      datasets: [{
        data: next24Hours.map((item: any) => item.temperature),
        color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`
      }]
    };

    setChartData(formatted);
  }, [weatherData]);

  if (!chartData) return null;

  return (
    <LineChart
      data={chartData}
      width={screenWidth - 32}
      height={200}
      chartConfig={{
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: {
          r: '4',
          strokeWidth: '2',
          stroke: '#ff6b35'
        }
      }}
      bezier
    />
  );
};
