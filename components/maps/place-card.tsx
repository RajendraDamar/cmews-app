import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    address: string;
  };
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <View className="rounded-lg bg-card p-4 shadow-lg">
      <Text className="mb-1 text-xl font-bold text-foreground">{place.name}</Text>
      <Text className="mb-4 text-muted-foreground">{place.address}</Text>

      <View className="flex-row gap-2">
        <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-md bg-primary px-4 py-3">
          <Ionicons name="navigate" size={16} color="#fff" />
          <Text className="font-medium text-primary-foreground">Directions</Text>
        </Pressable>
        <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-3">
          <Ionicons name="star-outline" size={16} color="#666" />
          <Text className="font-medium text-foreground">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
