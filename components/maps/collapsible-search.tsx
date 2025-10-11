import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '~/lib/theme-provider';
import * as Haptics from 'expo-haptics';

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(false);
    setSearchText('');
  };

  const handleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onSearch) {
      onSearch(searchText);
    }
  };

  return (
    <View className="absolute left-4 right-4 top-4 z-50">
      <Card className="overflow-hidden shadow-lg">
        {!isExpanded ? (
          <Pressable
            onPress={handleExpand}
            className="flex-row items-center gap-3 p-4 active:opacity-70"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8,
            }}>
            <Search size={20} color={iconColor} />
            <Text variant="muted" className="text-base">
              {placeholder}
            </Text>
          </Pressable>
        ) : (
          <View
            className="flex-row items-center gap-2 p-2"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8,
            }}>
            <View className="flex-1 flex-row items-center gap-2 rounded-lg bg-muted px-3 py-2.5">
              <Search size={20} color={iconColor} />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                className="flex-1 text-base text-foreground"
                autoFocus
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            <Pressable
              onPress={handleCollapse}
              className="h-10 w-10 items-center justify-center rounded-lg active:bg-muted active:opacity-70">
              <X size={20} color={iconColor} />
            </Pressable>
          </View>
        )}
      </Card>
    </View>
  );
}
