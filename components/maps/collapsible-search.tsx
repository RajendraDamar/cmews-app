import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';

interface CollapsibleSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function CollapsibleSearch({
  placeholder = 'Cari lokasi...',
  onSearch,
}: CollapsibleSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { colorScheme } = useTheme();

  const iconColor = colorScheme === 'dark' ? '#e5e7eb' : '#1f2937';
  const placeholderColor = colorScheme === 'dark' ? '#888' : '#999';

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setSearchText('');
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
  };

  return (
    <View className="absolute left-4 right-4 top-4 z-50">
      <Card className="overflow-hidden">
        {!isExpanded ? (
          <Pressable
            onPress={handleExpand}
            className="flex-row items-center gap-3 p-4 active:opacity-70">
            <Search size={20} color={iconColor} />
            <Text variant="muted">{placeholder}</Text>
          </Pressable>
        ) : (
          <View className="flex-row items-center gap-2 p-2">
            <View className="flex-1 flex-row items-center gap-2 rounded-md bg-muted px-3 py-2">
              <Search size={20} color={iconColor} />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                className="flex-1 text-foreground"
                autoFocus
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            <Pressable
              onPress={handleCollapse}
              className="h-10 w-10 items-center justify-center rounded-md active:opacity-70">
              <X size={20} color={iconColor} />
            </Pressable>
          </View>
        )}
      </Card>
    </View>
  );
}
