import { View, ScrollView, Pressable } from 'react-native';
import { Star, X, MapPin, Home, Briefcase, Plus } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Button } from '~/components/ui/button';
import { MOCK_SAVED_PLACES } from '~/constants/mock-data';
import { EmptyPlacesState } from '~/components/maps/empty-states';
import { useTheme } from '~/lib/theme-provider';

interface SavedPlacesDrawerProps {
  onPlaceSelect: (place: any) => void;
  onClose: () => void;
}

export function SavedPlacesDrawer({ onPlaceSelect, onClose }: SavedPlacesDrawerProps) {
  const { colorScheme } = useTheme();

  const getPlaceIcon = (name: string) => {
    if (name.toLowerCase().includes('home')) return Home;
    if (name.toLowerCase().includes('work')) return Briefcase;
    return MapPin;
  };

  const iconColor = colorScheme === 'dark' ? '#e5e7eb' : '#1f2937';

  return (
    <Card className="h-full shadow-lg">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <View className="flex-row items-center gap-2">
          <Star size={24} color="#f59e0b" fill="#f59e0b" />
          <CardTitle>Saved Places</CardTitle>
        </View>
        <Pressable onPress={onClose} className="ml-2">
          <X size={24} color={iconColor} />
        </Pressable>
      </CardHeader>

      <CardContent className="flex-1">
        <Button
          label="Add New Place"
          variant="outline"
          className="mb-4 flex-row items-center gap-2">
          <Plus size={16} color={iconColor} />
        </Button>

        <Separator className="mb-4" />

        <ScrollView showsVerticalScrollIndicator={false}>
          {MOCK_SAVED_PLACES.length === 0 ? (
            <EmptyPlacesState />
          ) : (
            <View className="gap-2">
              {MOCK_SAVED_PLACES.map((place) => {
                const Icon = getPlaceIcon(place.name);
                return (
                  <Pressable
                    key={place.id}
                    onPress={() => {
                      onPlaceSelect(place);
                      onClose();
                    }}
                    className="rounded-lg border border-border bg-card p-4 active:bg-muted">
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon size={20} color="#3b82f6" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold">{place.name}</Text>
                        <Text variant="muted" size="sm" numberOfLines={1}>
                          {place.address}
                        </Text>
                      </View>
                      <Star size={20} color="#f59e0b" fill="#f59e0b" />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </CardContent>
    </Card>
  );
}
