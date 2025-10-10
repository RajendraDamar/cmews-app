// Simplified Search Bar - Location search only
import { View } from 'react-native';
import { Search } from 'lucide-react-native';
import { Input } from '~/components/ui/input';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Cari lokasi...' }: SearchBarProps) {
  return (
    <View className="absolute left-4 right-4 top-4 z-10">
      <View className="flex-row items-center rounded-lg bg-card px-4 py-3 shadow-lg">
        <Search size={20} color="#666" />
        <Input
          onChangeText={onSearch}
          placeholder={placeholder}
          className="ml-2 flex-1 border-0 bg-transparent"
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}
