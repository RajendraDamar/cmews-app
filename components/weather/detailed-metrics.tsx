import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Card, CardContent } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Thermometer, Wind, Gauge, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

interface DetailedMetricsProps {
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  wind: {
    speed: number;
    direction: string;
    gust?: number;
  };
  atmospheric: {
    pressure: number;
    humidity: number;
    visibility: number;
  };
}

interface AccordionItemProps {
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  children: React.ReactNode;
}

function AccordionItem({ title, icon: Icon, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === 'dark' ? '#60a5fa' : '#3b82f6';
  const ChevronIcon = isOpen ? ChevronUp : ChevronDown;

  return (
    <View className="mb-2">
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between rounded-lg bg-muted p-4">
        <View className="flex-row items-center gap-3">
          <Icon size={20} color={iconColor} />
          <Text className="font-semibold">{title}</Text>
        </View>
        <ChevronIcon size={20} color={iconColor} />
      </Pressable>
      {isOpen && <View className="mt-2 rounded-lg bg-card p-4">{children}</View>}
    </View>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2">
      <Text variant="muted">{label}</Text>
      <Text className="font-medium">{value}</Text>
    </View>
  );
}

export function DetailedMetrics({ temperature, wind, atmospheric }: DetailedMetricsProps) {
  return (
    <Card className="mx-4 mt-4">
      <CardContent className="p-4">
        <Text className="mb-3 text-lg font-semibold">Detail Cuaca</Text>

        <AccordionItem title="Temperatur" icon={Thermometer}>
          <MetricRow label="Saat Ini" value={`${temperature.current}°C`} />
          <Separator className="my-1" />
          <MetricRow label="Terasa Seperti" value={`${temperature.feelsLike}°C`} />
          <Separator className="my-1" />
          <MetricRow label="Minimum" value={`${temperature.min}°C`} />
          <Separator className="my-1" />
          <MetricRow label="Maksimum" value={`${temperature.max}°C`} />
        </AccordionItem>

        <AccordionItem title="Angin" icon={Wind}>
          <MetricRow label="Kecepatan" value={`${wind.speed} km/h`} />
          <Separator className="my-1" />
          <MetricRow label="Arah" value={wind.direction} />
          {wind.gust && (
            <>
              <Separator className="my-1" />
              <MetricRow label="Hembusan" value={`${wind.gust} km/h`} />
            </>
          )}
        </AccordionItem>

        <AccordionItem title="Atmosfer" icon={Gauge}>
          <MetricRow label="Tekanan" value={`${atmospheric.pressure} hPa`} />
          <Separator className="my-1" />
          <MetricRow label="Kelembapan" value={`${atmospheric.humidity}%`} />
          <Separator className="my-1" />
          <MetricRow label="Jarak Pandang" value={`${atmospheric.visibility} km`} />
        </AccordionItem>
      </CardContent>
    </Card>
  );
}
