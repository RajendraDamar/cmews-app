// Simplified Search Bar - Location search only
import { View } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import { Input } from '~/components/ui/input';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Cari lokasi...' }: SearchBarProps) {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === 'dark' ? '#e5e7eb' : '#6b7280';
  return (
    <View className="absolute left-4 right-4 top-4 z-10">
      <View className="flex-row items-center rounded-lg bg-card px-4 py-3 shadow-lg">
  <Search size={20} color={iconColor} />
        <Input
          onChangeText={onSearch}
          placeholder={placeholder}
          className="ml-2 flex-1 border-0 bg-transparent"
          placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#71717a'}
        />
      </View>
    </View>
  );
}
