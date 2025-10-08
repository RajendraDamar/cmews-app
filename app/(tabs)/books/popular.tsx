import { ScrollView, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { MOCK_BOOKS } from '~/constants/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui';
import { Ionicons } from '@expo/vector-icons';

export default function PopularBooksScreen() {
  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="mb-4 text-2xl font-bold text-foreground">Popular Books</Text>
      {MOCK_BOOKS.map((book) => (
        <Card key={book.id} className="mb-4">
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>by {book.author}</CardDescription>
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
