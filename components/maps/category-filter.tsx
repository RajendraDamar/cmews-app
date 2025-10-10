import { ScrollView, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import {
  Utensils,
  Fuel,
  ParkingCircle,
  Bed,
  Banknote,
  Cross,
  Trees,
  Landmark,
} from 'lucide-react-native';
import { MAP_CATEGORIES } from '~/constants/mock-data';
import { useTheme } from '~/lib/theme-provider';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { colorScheme } = useTheme();

  const iconMap: Record<string, any> = {
    restaurant: Utensils,
    gas: Fuel,
    parking: ParkingCircle,
    hotel: Bed,
    atm: Banknote,
    hospital: Cross,
    park: Trees,
    landmark: Landmark,
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row gap-2"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
      <Pressable
        onPress={() => onSelectCategory(null)}
        className={`rounded-full px-4 py-2 ${
          selectedCategory === null ? 'bg-primary' : colorScheme === 'dark' ? 'bg-card' : 'bg-muted'
        }`}>
        <Text
          className={`text-sm font-medium ${
            selectedCategory === null ? 'text-primary-foreground' : ''
          }`}>
          All
        </Text>
      </Pressable>
      {MAP_CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.id];
        const isSelected = selectedCategory === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelectCategory(cat.id)}
            className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 ${
              isSelected ? 'bg-primary' : colorScheme === 'dark' ? 'bg-card' : 'bg-muted'
            }`}>
            {Icon && (
              <Icon
                size={14}
                color={isSelected ? '#fff' : colorScheme === 'dark' ? '#a1a1aa' : '#52525b'}
              />
            )}
            <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : ''}`}>
              {cat.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
