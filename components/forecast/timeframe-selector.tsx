import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import type { Timeframe } from '~/lib/types/maritime';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onSelect: (timeframe: Timeframe) => void;
}

export function TimeframeSelector({ selected, onSelect }: TimeframeSelectorProps) {
  const timeframes: { value: Timeframe; label: string }[] = [
    { value: '24h', label: '24 Jam' },
    { value: '3d', label: '3 Hari' },
    { value: '7d', label: '7 Hari' },
  ];

  return (
    <View className="mb-4 flex-row gap-2">
      {timeframes.map((timeframe) => {
        const isSelected = selected === timeframe.value;
        return (
          <Pressable
            key={timeframe.value}
            onPress={() => onSelect(timeframe.value)}
            className={`flex-1 rounded-lg border px-4 py-2 ${
              isSelected ? 'border-primary bg-primary' : 'border-border bg-card'
            }`}>
            <Text
              className={`text-center font-semibold ${
                isSelected ? 'text-primary-foreground' : 'text-foreground'
              }`}>
              {timeframe.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
