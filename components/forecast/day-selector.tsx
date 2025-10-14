import { Pressable, ScrollView } from 'react-native';
import { Text } from '../ui/text';
import * as Haptics from 'expo-haptics';

interface DaySelectorProps {
  days: {
    day: string;
    date: string;
  }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function DaySelector({ days, selectedIndex, onSelect }: DaySelectorProps) {
  const handleSelect = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(index);
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerClassName="gap-2 px-4"
    >
      {days.map((dayData, index) => {
        const isSelected = selectedIndex === index;
        const dateObj = new Date(dayData.date);
        const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        
        return (
          <Pressable
            key={index}
            onPress={() => handleSelect(index)}
            className={`min-w-[80px] rounded-lg border px-3 py-2 ${
              isSelected ? 'border-primary bg-primary' : 'border-border bg-card'
            }`}
          >
            <Text
              className={`text-center text-xs font-medium ${
                isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              {dateStr}
            </Text>
            <Text
              className={`text-center text-sm font-semibold ${
                isSelected ? 'text-primary-foreground' : 'text-foreground'
              }`}
            >
              {dayData.day}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
