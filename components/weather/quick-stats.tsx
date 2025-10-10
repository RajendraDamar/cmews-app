import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Droplets, Wind, Thermometer } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

interface QuickStatsProps {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

interface StatCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string;
  progress?: number;
}

function StatCard({ icon: Icon, label, value, progress }: StatCardProps) {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === 'dark' ? '#60a5fa' : '#3b82f6';

  return (
    <Card className="min-w-[140px]">
      <CardContent className="p-4">
        <View className="flex-row items-center gap-3">
          <Icon size={24} color={iconColor} />
          <View className="flex-1">
            <Text variant="muted" size="sm">
              {label}
            </Text>
            <Text className="text-xl font-semibold">{value}</Text>
          </View>
        </View>
        {progress !== undefined && (
          <View className="mt-3">
            <View className="h-2 overflow-hidden rounded-full bg-secondary">
              <View className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </View>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

export function QuickStats({ humidity, windSpeed, feelsLike }: QuickStatsProps) {
  return (
    <View className="px-4 pt-4">
      <Text className="mb-3 text-lg font-semibold">Ringkasan Cepat</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}>
        <StatCard icon={Droplets} label="Kelembapan" value={`${humidity}%`} progress={humidity} />
        <StatCard icon={Wind} label="Kecepatan Angin" value={`${windSpeed} km/h`} />
        <StatCard icon={Thermometer} label="Terasa Seperti" value={`${feelsLike}°`} />
      </ScrollView>
    </View>
  );
}
