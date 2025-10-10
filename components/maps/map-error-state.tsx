import { View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { useTheme } from '~/lib/theme-provider';

interface MapErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function MapErrorState({ message = 'Unable to load map', onRetry }: MapErrorStateProps) {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === 'dark' ? '#6b7280' : '#9ca3af';

  return (
    <View className="flex-1 items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-md">
        <CardContent className="items-center gap-4 p-6">
          <AlertCircle size={64} color={iconColor} />
          <Text className="text-center text-xl font-semibold">Map Unavailable</Text>
          <Text variant="muted" className="text-center">
            {message}
          </Text>
          {onRetry && <Button label="Try Again" onPress={onRetry} className="w-full" />}
        </CardContent>
      </Card>
    </View>
  );
}
