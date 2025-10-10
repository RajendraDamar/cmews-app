import { View } from 'react-native';
import { Skeleton } from '~/components/ui/skeleton';

export function MapSkeleton() {
  return (
    <View className="flex-1 bg-muted p-4">
      <Skeleton className="mb-4 h-14 w-full rounded-lg" />
      <View className="flex-1 rounded-lg bg-muted-foreground/10" />
      <View className="absolute bottom-4 right-4 gap-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </View>
    </View>
  );
}
