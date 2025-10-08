import { Stack } from 'expo-router';

import { ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

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
          </CardContent>
          <CardFooter>
            <Button label="Footer Action" size="sm" variant="ghost" />
          </CardFooter>
        </Card>
      </ScrollView>
    </>
  );
}
