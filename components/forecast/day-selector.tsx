import { View, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/lib/theme-provider';
import { cn } from '~/lib/utils';

interface DaySelectorProps {
  days: { label: string; value: number }[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export function DaySelector({ days, selectedDay, onSelectDay }: DaySelectorProps) {
  const { colorScheme } = useTheme();

  return (
    <View className="flex-row gap-2 px-4 pb-3">
      {days.map((day) => {
        const isSelected = selectedDay === day.value;
        return (
          <Pressable
            key={day.value}
            onPress={() => onSelectDay(day.value)}
            className={cn(
              'flex-1 rounded-lg border py-2.5',
              isSelected
                ? 'border-primary bg-primary'
                : colorScheme === 'dark'
                  ? 'border-border bg-card'
                  : 'border-border bg-card'
            )}>
            <Text
              className={cn(
                'text-center text-sm font-medium',
                isSelected ? 'text-primary-foreground' : 'text-foreground'
              )}>
              {day.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
