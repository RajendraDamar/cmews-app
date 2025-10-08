import { Stack } from 'expo-router';

import { ScrollView, View, Text } from 'react-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui';
import { MOCK_APPS } from '~/constants/mock-data';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Games & Apps' }} />
      <ScrollView className="flex-1 bg-background p-4">
        <Text className="mb-4 text-2xl font-bold text-foreground">Popular Apps</Text>
        {MOCK_APPS.map((app) => (
          <Card key={app.id} className="mb-4">
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
              <CardDescription>{app.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={16} color="#FFC107" />
                <Text className="text-sm text-muted-foreground">{app.rating}</Text>
              </View>
            </CardContent>
          </Card>
        ))}
      </ScrollView>
    </>
  );
}
