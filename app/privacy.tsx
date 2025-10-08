import { Stack } from 'expo-router';
import { Text, ScrollView } from 'react-native';

export default function PrivacyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Privacy' }} />
      <ScrollView className="flex-1 bg-background p-6">
        <Text className="mb-4 text-2xl font-bold text-foreground">Privacy Policy</Text>
        <Text className="mb-4 text-base leading-6 text-muted-foreground">
          This is a placeholder privacy policy screen. In a real application, you would include your
          full privacy policy here, detailing how you collect, use, and protect user data.
        </Text>
        <Text className="mb-4 text-base leading-6 text-muted-foreground">
          Key points typically covered in a privacy policy include:
        </Text>
        <Text className="mb-2 text-base leading-6 text-muted-foreground">
          • What information we collect
        </Text>
        <Text className="mb-2 text-base leading-6 text-muted-foreground">
          • How we use your information
        </Text>
        <Text className="mb-2 text-base leading-6 text-muted-foreground">
          • How we protect your information
        </Text>
        <Text className="mb-2 text-base leading-6 text-muted-foreground">
          • Your rights and choices
        </Text>
        <Text className="mb-2 text-base leading-6 text-muted-foreground">
          • Contact information
        </Text>
      </ScrollView>
    </>
  );
}
