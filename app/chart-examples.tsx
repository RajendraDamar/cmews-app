import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  ChartKitTemperatureChart,
  ChartKitPrecipitationChart,
  ChartKitWindChart,
  ChartKitWaveChart,
} from '~/components/charts';

// Sample data for demonstration
const temperatureData = [
  { time: '00:00', temp: 27, humidity: 75 },
  { time: '03:00', temp: 26, humidity: 80 },
  { time: '06:00', temp: 28, humidity: 70 },
  { time: '09:00', temp: 31, humidity: 65 },
  { time: '12:00', temp: 33, humidity: 60 },
  { time: '15:00', temp: 32, humidity: 62 },
  { time: '18:00', temp: 29, humidity: 72 },
  { time: '21:00', temp: 28, humidity: 75 },
];

const precipitationData = [
  { time: '00:00', precipitation: 2.5 },
  { time: '03:00', precipitation: 5.2 },
  { time: '06:00', precipitation: 0.8 },
  { time: '09:00', precipitation: 0.0 },
  { time: '12:00', precipitation: 1.5 },
  { time: '15:00', precipitation: 3.2 },
  { time: '18:00', precipitation: 4.1 },
  { time: '21:00', precipitation: 2.0 },
];

const windData = [
  { direction: 'Utara', speed: 15, directionDegrees: 0 },
  { direction: 'Timur Laut', speed: 12, directionDegrees: 45 },
  { direction: 'Timur', speed: 18, directionDegrees: 90 },
];

const waveData = [
  { time: '00:00', height: 1.5 },
  { time: '03:00', height: 2.2 },
  { time: '06:00', height: 1.8 },
  { time: '09:00', height: 1.2 },
  { time: '12:00', height: 1.6 },
  { time: '15:00', height: 2.0 },
  { time: '18:00', height: 2.5 },
  { time: '21:00', height: 1.9 },
];

/**
 * Chart Examples Demo Page
 * 
 * This page demonstrates all the cross-platform charts available in the app.
 * Each chart is built with React Native Chart Kit for perfect web compatibility.
 * 
 * Features:
 * - Cross-platform SVG rendering
 * - Smooth bezier animations
 * - 100% React Native Web compatible
 * - Responsive to theme changes
 * - Indonesian language labels
 */
export default function ChartExamplesPage() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        {/* Header */}
        <View className="mb-2">
          <Text className="text-2xl font-bold">Chart Kit Demo</Text>
          <Text className="text-muted-foreground mt-1">
            Cross-platform weather visualization charts
          </Text>
        </View>

        {/* Temperature Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Temperature & Humidity Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartKitTemperatureChart data={temperatureData} animated={true} />
            <Text className="text-xs text-muted-foreground mt-2">
              Dual-line chart with bezier curves and gradient fill
            </Text>
          </CardContent>
        </Card>

        {/* Precipitation Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Precipitation Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartKitPrecipitationChart data={precipitationData} animated={true} />
            <Text className="text-xs text-muted-foreground mt-2">
              Bar chart showing rainfall intensity over time
            </Text>
          </CardContent>
        </Card>

        {/* Wind Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Wind Speed Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartKitWindChart data={windData} animated={true} />
            <Text className="text-xs text-muted-foreground mt-2">
              Bar chart visualization with direction and speed indicators
            </Text>
          </CardContent>
        </Card>

        {/* Wave Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Maritime Wave Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartKitWaveChart data={waveData} animated={true} />
            <Text className="text-xs text-muted-foreground mt-2">
              Wave height visualization with smooth bezier curves
            </Text>
          </CardContent>
        </Card>

        {/* Performance Info */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Characteristics</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-green-600 dark:text-green-400 font-bold">✓</Text>
                <Text className="text-sm">100% React Native Web compatible</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-green-600 dark:text-green-400 font-bold">✓</Text>
                <Text className="text-sm">SVG rendering for all platforms</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-green-600 dark:text-green-400 font-bold">✓</Text>
                <Text className="text-sm">Beautiful bezier animations</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-green-600 dark:text-green-400 font-bold">✓</Text>
                <Text className="text-sm">~50KB bundle impact</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-green-600 dark:text-green-400 font-bold">✓</Text>
                <Text className="text-sm">Zero configuration needed</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Technical Info */}
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="gap-1">
              <Text className="text-sm">• react-native-chart-kit (latest)</Text>
              <Text className="text-sm">• react-native-svg (15.12.1)</Text>
              <Text className="text-sm">• Pure JavaScript implementation</Text>
              <Text className="text-sm">• Indonesian locale support</Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
