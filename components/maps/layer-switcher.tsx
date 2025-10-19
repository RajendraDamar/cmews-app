import { View, Pressable } from 'react-native';
import { Map, Satellite, Mountain, Layers } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { useTheme } from '~/lib/theme-provider';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { getThemeColor } from '~/lib/constants';

interface LayerSwitcherProps {
  mapType: 'standard' | 'satellite' | 'terrain';
  onMapTypeChange: (type: 'standard' | 'satellite' | 'terrain') => void;
  layers: {
    traffic: boolean;
    transit: boolean;
    bicycle: boolean;
  };
  onLayerToggle: (layer: 'traffic' | 'transit' | 'bicycle') => void;
}

export function LayerSwitcher({
  mapType,
  onMapTypeChange,
  layers,
  onLayerToggle,
}: LayerSwitcherProps) {
  const { colorScheme } = useTheme();
  const themeColors = getThemeColor(colorScheme === 'dark');

  const iconColor = themeColors.icon.foreground;
  const activeColor = themeColors.primary;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg active:opacity-70">
          <Layers size={20} color={iconColor} />
        </Pressable>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <View className="gap-3">
          <Text className="text-lg font-semibold">Map Layers</Text>

          <Separator />

          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">Map Type</Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => onMapTypeChange('standard')}
                className={`flex-1 items-center gap-1 rounded-lg border p-3 ${
                  mapType === 'standard' ? 'border-primary bg-primary/10' : 'border-border'
                }`}>
                <Map size={20} color={mapType === 'standard' ? activeColor : iconColor} />
                <Text
                  className={`text-xs ${mapType === 'standard' ? 'font-semibold text-primary' : ''}`}>
                  Map
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onMapTypeChange('satellite')}
                className={`flex-1 items-center gap-1 rounded-lg border p-3 ${
                  mapType === 'satellite' ? 'border-primary bg-primary/10' : 'border-border'
                }`}>
                <Satellite size={20} color={mapType === 'satellite' ? activeColor : iconColor} />
                <Text
                  className={`text-xs ${mapType === 'satellite' ? 'font-semibold text-primary' : ''}`}>
                  Satellite
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onMapTypeChange('terrain')}
                className={`flex-1 items-center gap-1 rounded-lg border p-3 ${
                  mapType === 'terrain' ? 'border-primary bg-primary/10' : 'border-border'
                }`}>
                <Mountain size={20} color={mapType === 'terrain' ? activeColor : iconColor} />
                <Text
                  className={`text-xs ${mapType === 'terrain' ? 'font-semibold text-primary' : ''}`}>
                  Terrain
                </Text>
              </Pressable>
            </View>
          </View>

          <Separator />

          <View className="gap-3">
            <Text className="text-sm font-medium text-muted-foreground">Overlays</Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm">Traffic</Text>
              <Switch checked={layers.traffic} onCheckedChange={() => onLayerToggle('traffic')} />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm">Transit</Text>
              <Switch checked={layers.transit} onCheckedChange={() => onLayerToggle('transit')} />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm">Bicycle</Text>
              <Switch checked={layers.bicycle} onCheckedChange={() => onLayerToggle('bicycle')} />
            </View>
          </View>
        </View>
      </PopoverContent>
    </Popover>
  );
}
