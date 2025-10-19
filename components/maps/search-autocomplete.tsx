import { View, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { Search, MapPin, Clock, X } from 'lucide-react-native';
import { MOCK_MAP_PLACES, MOCK_RECENT_SEARCHES } from '~/constants/mock-data';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { EmptySearchState } from '~/components/maps/empty-states';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';

interface SearchAutocompleteProps {
  onPlaceSelect: (place: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchAutocomplete({ onPlaceSelect, onFocus, onBlur }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof MOCK_MAP_PLACES>([]);
  const [showRecent, setShowRecent] = useState(false);
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      setResults(
        MOCK_MAP_PLACES.filter(
          (p) =>
            p.name.toLowerCase().includes(text.toLowerCase()) ||
            p.address.toLowerCase().includes(text.toLowerCase())
        )
      );
      setShowRecent(false);
    } else {
      setResults([]);
      setShowRecent(true);
    }
  };

  const handleFocus = () => {
    setShowRecent(true);
    onFocus?.();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowRecent(true);
  };

  const iconColor = themeColors.icon.muted;

  return (
    <Card className="shadow-lg">
      <CardContent className="p-0">
        <View className="flex-row items-center px-4 py-3">
          <Search size={20} color={iconColor} />
          <Input
            value={query}
            onChangeText={handleSearch}
            onFocus={handleFocus}
            onBlur={onBlur}
            placeholder="Search for places..."
            className="ml-2 flex-1 border-0 bg-transparent"
            placeholderTextColor={iconColor}
          />
          {query.length > 0 && (
            <Pressable onPress={handleClear} className="ml-2">
              <X size={20} color={iconColor} />
            </Pressable>
          )}
        </View>

        {showRecent && query.length === 0 && (
          <>
            <Separator />
            <View className="px-4 py-2">
              <Text className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Recent Searches
              </Text>
              {MOCK_RECENT_SEARCHES.map((search, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSearch(search)}
                  className="flex-row items-center gap-3 py-2 active:opacity-70">
                  <Clock size={16} color={iconColor} />
                  <Text>{search}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {results.length > 0 && (
          <>
            <Separator />
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<EmptySearchState />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onPlaceSelect(item);
                    setResults([]);
                    setQuery('');
                    setShowRecent(false);
                  }}
                  className="flex-row items-start gap-3 border-t border-border px-4 py-3 active:bg-muted">
                  <MapPin size={20} color={iconColor} className="mt-0.5" />
                  <View className="flex-1">
                    <Text className="font-medium">{item.name}</Text>
                    <Text variant="muted" size="sm" numberOfLines={1}>
                      {item.address}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
