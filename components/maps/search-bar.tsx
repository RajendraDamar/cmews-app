import { View, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_MAP_PLACES } from '~/constants/mock-data';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Card, CardContent } from '~/components/ui/card';

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
    <Card className="shadow-lg">
      <CardContent className="p-0">
        <View className="flex-row items-center px-4 py-2">
          <Ionicons name="search" size={20} color="#666" />
          <Input
            value={query}
            onChangeText={handleSearch}
            placeholder="Search places..."
            className="ml-2 flex-1 border-0 bg-transparent"
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
                className="border-t border-border px-4 py-3 active:bg-muted">
                <Text className="font-medium">{item.name}</Text>
                <Text variant="muted" size="sm">
                  {item.address}
                </Text>
              </Pressable>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
