import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Input } from '~/components/ui/input';
import { useTheme } from '~/lib/theme-provider';
import { getThemeColor } from '~/lib/constants';

interface DesktopMapPanelProps {
  onAddReport: () => void;
  onSearch?: (query: string) => void;
}

export function DesktopMapPanel({
  onAddReport,
  onSearch,
}: DesktopMapPanelProps) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <View
      className="absolute left-6 top-6 z-50 flex-col gap-3"
      style={{
        width: 280,
      }}>
      {/* Search Input (Restricted) */}
      <View
        className="rounded-lg border border-border bg-card shadow-lg opacity-60"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}>
        <Pressable onPress={() => alert('Pencarian lokasi sementara dinonaktifkan')}>
          <View pointerEvents="none">
            <Input
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              placeholder="Pencarian dinonaktifkan..."
              className="h-11 border-0"
              placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
              returnKeyType="search"
              editable={false}
            />
          </View>
        </Pressable>
      </View>

      {/* Floating Action Button - Add Report */}
      <Pressable
        onPress={onAddReport}
        className="mt-1 h-12 w-12 items-center justify-center self-start rounded-full shadow-xl active:scale-95 border bg-card border-border"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}>
        <Plus size={22} color={colorScheme === 'dark' ? 'hsl(210 40% 98%)' : themeColors.icon.foreground} />
      </Pressable>
    </View>
  );
}
