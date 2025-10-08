import { View, TextInput, FlatList, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_MAP_PLACES } from '~/constants/mock-data';

interface SearchBarProps {
  onPlaceSelect: (place: any) => void;
}

export function SearchBar({ onPlaceSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof MOCK_MAP_PLACES>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      setResults(MOCK_MAP_PLACES.filter((p) => p.name.toLowerCase().includes(text.toLowerCase())));
    } else {
      setResults([]);
    }
  };

  return (
    <View className="rounded-lg bg-card shadow-lg">
      <View className="flex-row items-center border-b border-border px-4 py-3">
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder="Search places..."
          className="ml-3 flex-1 text-foreground"
          placeholderTextColor="#999"
        />
      </View>

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onPlaceSelect(item);
                setResults([]);
                setQuery('');
              }}
              className="border-b border-border px-4 py-3">
              <Text className="font-medium text-foreground">{item.name}</Text>
              <Text className="text-sm text-muted-foreground">{item.address}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
