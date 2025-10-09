import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useTheme } from '~/lib/theme-provider';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    address: string;
  };
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { colorScheme } = useTheme();

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle>{place.name}</CardTitle>
        <Text variant="muted" size="sm">
          {place.address}
        </Text>
      </CardHeader>
      <CardContent className="flex-row gap-2 pt-0">
        <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-md bg-primary px-4 py-3">
          <Ionicons name="navigate" size={16} color="#fff" />
          <Text className="font-medium text-primary-foreground">Directions</Text>
        </Pressable>
        <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-3">
          <Ionicons
            name="star-outline"
            size={16}
            color={colorScheme === 'dark' ? '#999' : '#666'}
          />
          <Text className="font-medium">Save</Text>
        </Pressable>
      </CardContent>
    </Card>
  );
}
