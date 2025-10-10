import { View } from 'react-native';
import { Card, CardContent } from '../ui/card';
import { Text } from '../ui/text';
import { Badge } from '../ui/badge';

interface SeaAreaCardProps {
  seaArea: string;
  data: {
    primary: string;
    secondary?: string;
    badge?: {
      label: string;
      variant?: 'default' | 'secondary' | 'destructive';
    };
  };
  type?: 'wind' | 'wave' | 'current';
}

export function SeaAreaCard({ seaArea, data, type = 'wind' }: SeaAreaCardProps) {
  return (
    <Card className="min-w-[280px]">
      <CardContent className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-semibold">{seaArea}</Text>
          {data.badge && (
            <Badge
              label={data.badge.label}
              variant={data.badge.variant || 'default'}
              className="ml-2"
            />
          )}
        </View>
        <Text className="text-2xl font-bold">{data.primary}</Text>
        {data.secondary && (
          <Text variant="muted" className="mt-1">
            {data.secondary}
          </Text>
        )}
      </CardContent>
    </Card>
  );
}
