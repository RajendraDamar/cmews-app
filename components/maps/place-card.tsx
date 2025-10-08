import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    address: string;
  };
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle>{place.name}</CardTitle>
        <Text variant="muted" size="sm">
          {place.address}
        </Text>
      </CardHeader>
      <CardContent className="flex-row gap-2 pt-0">
        <Button className="flex-1 flex-row items-center gap-2">
          <Ionicons name="navigate" size={16} color="#fff" />
          <Text className="font-medium text-primary-foreground">Directions</Text>
        </Button>
        <Button variant="outline" className="flex-1 flex-row items-center gap-2">
          <Ionicons name="star-outline" size={16} color="#666" />
          <Text className="font-medium">Save</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
