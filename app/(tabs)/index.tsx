import { Stack } from 'expo-router';

import { ScrollView, View } from 'react-native';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Separator } from '~/components/ui/separator';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <ScrollView className="flex-1 p-6">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>React Native Reusables</CardTitle>
            <CardDescription>Beautiful UI components for React Native</CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <Text variant="muted" size="sm">
              Button Variants:
            </Text>
            <Button label="Default Button" onPress={() => console.log('Pressed')} />
            <Button
              label="Secondary Button"
              variant="secondary"
              onPress={() => console.log('Pressed')}
            />
            <Button
              label="Destructive Button"
              variant="destructive"
              onPress={() => console.log('Pressed')}
            />
            <Button
              label="Outline Button"
              variant="outline"
              onPress={() => console.log('Pressed')}
            />

            <Separator className="my-4" />

            <Text variant="muted" size="sm">
              Badge Variants:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <Badge label="Default" />
              <Badge label="Secondary" variant="secondary" />
              <Badge label="Destructive" variant="destructive" />
              <Badge label="Outline" variant="outline" />
            </View>

            <Separator className="my-4" />

            <Text variant="muted" size="sm">
              Input Component:
            </Text>
            <Input placeholder="Enter your name" />
          </CardContent>
          <CardFooter>
            <Button label="Footer Action" size="sm" variant="ghost" />
          </CardFooter>
        </Card>
      </ScrollView>
    </>
  );
}
