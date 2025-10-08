import { ScrollView, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui';
import { MOCK_BOOKS } from '~/constants/mock-data';
import { Ionicons } from '@expo/vector-icons';

export default function TopChartsScreen() {
  // Sort books by rating for top charts
  const topBooks = [...MOCK_BOOKS].sort((a, b) => b.rating - a.rating);

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="mb-4 text-2xl font-bold text-foreground">Top Charts</Text>
      {topBooks.map((book, index) => (
        <Card key={book.id} className="mb-4">
          <CardHeader>
            <View className="flex-row items-center gap-3">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Text className="font-bold text-primary-foreground">{index + 1}</Text>
              </View>
              <View className="flex-1">
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>by {book.author}</CardDescription>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text className="text-sm text-muted-foreground">{book.rating}</Text>
            </View>
          </CardContent>
        </Card>
      ))}
    </ScrollView>
  );
}
