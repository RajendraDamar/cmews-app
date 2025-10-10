import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, CardHeader, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { WeatherIcon } from './weather-icon';
import { parseBMKGDateTime, formatTime24 } from '~/lib/utils/indonesian-locale';

interface HourlyForecastProps {
  hourlyData: {
    time: string; // BMKG datetime format
    weather: string; // Weather condition
    temp: number;
  }[];
}

export function HourlyForecastCard({ hourlyData }: HourlyForecastProps) {
  return (
    <Card className="mx-4 mt-4">
      <CardHeader className="pb-3">
        <Text className="text-lg font-semibold">Prakiraan Per Jam</Text>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingVertical: 8 }}>
          {hourlyData.map((hour, index) => {
            const time = parseBMKGDateTime(hour.time);
            const timeStr = formatTime24(time);

            return (
              <View key={index} className="items-center">
                <Text variant="muted" size="sm" className="mb-2">
                  {timeStr}
                </Text>
                <WeatherIcon condition={hour.weather} size={40} />
                <Text className="mt-2 font-semibold">{hour.temp}°</Text>
              </View>
            );
          })}
        </ScrollView>
      </CardContent>
    </Card>
  );
}
