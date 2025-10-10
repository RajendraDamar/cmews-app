import { View, ScrollView, Pressable } from 'react-native';
import { X, ArrowUp, ArrowRight, ArrowLeft, MapPin, Clock, Route } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { MOCK_ROUTE } from '~/constants/mock-data';
import { useTheme } from '~/lib/theme-provider';

interface DirectionsPanelProps {
  origin?: string;
  destination?: string;
  onClose: () => void;
}

export function DirectionsPanel({ origin, destination, onClose }: DirectionsPanelProps) {
  const { colorScheme } = useTheme();

  const getManeuverIcon = (maneuver: string) => {
    switch (maneuver) {
      case 'turn-right':
        return ArrowRight;
      case 'turn-left':
        return ArrowLeft;
      case 'straight':
        return ArrowUp;
      case 'arrive':
        return MapPin;
      default:
        return ArrowUp;
    }
  };

  const iconColor = colorScheme === 'dark' ? '#e5e7eb' : '#1f2937';

  return (
    <Card className="h-full shadow-lg">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <View className="flex-1">
          <CardTitle>Directions</CardTitle>
          <Text variant="muted" size="sm">
            {origin || 'Your location'} → {destination || 'Destination'}
          </Text>
        </View>
        <Pressable onPress={onClose} className="ml-2">
          <X size={24} color={iconColor} />
        </Pressable>
      </CardHeader>

      <CardContent className="flex-1">
        <View className="mb-4 flex-row items-center justify-between rounded-lg bg-muted p-3">
          <View className="flex-row items-center gap-2">
            <Route size={20} color="#3b82f6" />
            <View>
              <Text className="font-semibold">{MOCK_ROUTE.distance}</Text>
              <Text variant="muted" size="sm">
                Total distance
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Clock size={20} color="#3b82f6" />
            <View>
              <Text className="font-semibold">{MOCK_ROUTE.duration}</Text>
              <Text variant="muted" size="sm">
                {MOCK_ROUTE.durationInTraffic} in traffic
              </Text>
            </View>
          </View>
        </View>

        <Button label="Start Navigation" className="mb-4" />

        <Separator className="mb-4" />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-3">
            {MOCK_ROUTE.steps.map((step, index) => {
              const Icon = getManeuverIcon(step.maneuver);
              return (
                <View key={step.id} className="flex-row gap-3">
                  <View className="items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Icon size={20} color="#3b82f6" />
                    </View>
                    {index < MOCK_ROUTE.steps.length - 1 && (
                      <View className="mt-1 h-full w-0.5 bg-border" />
                    )}
                  </View>

                  <View className="flex-1 pb-4">
                    <Text className="font-medium">{step.instruction}</Text>
                    <Text variant="muted" size="sm">
                      {step.distance} • {step.duration}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </CardContent>
    </Card>
  );
}
