import { Navigation, Star, Phone, Globe, Clock, Share2, DollarSign } from 'lucide-react-native';
import { Pressable, View, Image } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Badge } from '~/components/ui/badge';
import { useTheme } from '~/lib/theme-provider';
import { useState } from 'react';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    address: string;
    rating?: number;
    reviews?: number;
    phone?: string;
    website?: string;
    hours?: string;
    photos?: string[];
    priceLevel?: number;
    description?: string;
    category?: string;
  };
  onDirections?: () => void;
  onSave?: () => void;
}

export function PlaceCard({ place, onDirections, onSave }: PlaceCardProps) {
  const { colorScheme } = useTheme();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.();
  };

  const iconColor = colorScheme === 'dark' ? '#e5e7eb' : '#1f2937';
  const mutedColor = colorScheme === 'dark' ? '#a1a1aa' : '#71717a';

  const renderPriceLevel = (level?: number) => {
    if (!level) return null;
    return (
      <View className="flex-row items-center gap-1">
        {Array.from({ length: level }).map((_, i) => (
          <DollarSign key={i} size={12} color="#10b981" />
        ))}
        {Array.from({ length: 4 - level }).map((_, i) => (
          <DollarSign key={i + level} size={12} color={mutedColor} />
        ))}
      </View>
    );
  };

  return (
    <Card className="shadow-lg">
      {place.photos && place.photos.length > 0 && (
        <View className="overflow-hidden rounded-t-xl">
          <Image
            source={{ uri: place.photos[0] }}
            className="h-40 w-full bg-muted"
            resizeMode="cover"
          />
        </View>
      )}

      <CardHeader className="pb-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <CardTitle>{place.name}</CardTitle>
            {place.category && (
              <Badge variant="secondary" className="mt-1 self-start">
                <Text className="text-xs capitalize">{place.category}</Text>
              </Badge>
            )}
          </View>
          <Pressable onPress={() => {}}>
            <Share2 size={20} color={mutedColor} />
          </Pressable>
        </View>

        {(place.rating || place.priceLevel) && (
          <View className="mt-2 flex-row items-center gap-3">
            {place.rating && (
              <View className="flex-row items-center gap-1">
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <Text className="font-semibold">{place.rating}</Text>
                {place.reviews && (
                  <Text variant="muted" size="sm">
                    ({place.reviews.toLocaleString()})
                  </Text>
                )}
              </View>
            )}
            {place.priceLevel && renderPriceLevel(place.priceLevel)}
          </View>
        )}

        <Text variant="muted" size="sm" className="mt-2">
          {place.address}
        </Text>

        {place.description && (
          <Text variant="muted" size="sm" className="mt-2">
            {place.description}
          </Text>
        )}
      </CardHeader>

      <Separator />

      <CardContent className="gap-3 pt-3">
        {place.hours && (
          <View className="flex-row items-center gap-2">
            <Clock size={16} color={mutedColor} />
            <Text className="flex-1 text-sm">{place.hours}</Text>
          </View>
        )}

        {place.phone && (
          <View className="flex-row items-center gap-2">
            <Phone size={16} color={mutedColor} />
            <Text className="flex-1 text-sm">{place.phone}</Text>
          </View>
        )}

        {place.website && (
          <View className="flex-row items-center gap-2">
            <Globe size={16} color={mutedColor} />
            <Text className="flex-1 text-sm" numberOfLines={1}>
              {place.website}
            </Text>
          </View>
        )}

        <Separator className="my-1" />

        <View className="flex-row gap-2">
          <Pressable
            onPress={onDirections}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 active:opacity-80">
            <Navigation size={16} color="hsl(210 40% 98%)" />
            <Text className="font-medium text-primary-foreground">Directions</Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-3 active:opacity-80">
            <Star
              size={16}
              color={isSaved ? '#f59e0b' : iconColor}
              fill={isSaved ? '#f59e0b' : 'transparent'}
            />
            <Text className="font-medium">{isSaved ? 'Saved' : 'Save'}</Text>
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}
