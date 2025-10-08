import { ScrollView, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent } from '~/components/ui';

export default function CategoriesScreen() {
  const categories = [
    { id: 1, name: 'Fiction', icon: '📚', count: 120 },
    { id: 2, name: 'Non-Fiction', icon: '📖', count: 85 },
    { id: 3, name: 'Mystery', icon: '🔍', count: 45 },
    { id: 4, name: 'Science Fiction', icon: '🚀', count: 67 },
    { id: 5, name: 'Romance', icon: '💕', count: 92 },
    { id: 6, name: 'Biography', icon: '👤', count: 38 },
    { id: 7, name: 'Self-Help', icon: '🌟', count: 54 },
    { id: 8, name: 'History', icon: '🏛️', count: 41 },
  ];

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="mb-4 text-2xl font-bold text-foreground">Browse by Category</Text>
      <View className="gap-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">{category.icon}</Text>
                <Text className="text-lg font-semibold text-foreground">{category.name}</Text>
              </View>
              <Text className="text-sm text-muted-foreground">{category.count} books</Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
