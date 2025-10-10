import { View } from 'react-native';
import { Search, MapPin } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/lib/theme-provider';

interface EmptySearchStateProps {
  message?: string;
}

export function EmptySearchState({ message = 'No places found' }: EmptySearchStateProps) {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === 'dark' ? '#6b7280' : '#9ca3af';

  return (
    <View className="items-center gap-3 p-6">
      <Search size={48} color={iconColor} />
      <Text className="text-center font-semibold">{message}</Text>
      <Text variant="muted" className="text-center">
        Try searching for restaurants, parks, or landmarks
      </Text>
    </View>
  );
}

export function EmptyPlacesState() {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === 'dark' ? '#6b7280' : '#9ca3af';

  return (
    <View className="items-center gap-3 p-6">
      <MapPin size={48} color={iconColor} />
      <Text className="text-center font-semibold">No saved places yet</Text>
      <Text variant="muted" className="text-center">
        Save your favorite places to access them quickly
      </Text>
    </View>
  );
}
