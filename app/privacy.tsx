import { Stack } from 'expo-router';
import { Text, ScrollView, View } from 'react-native';
import { useTheme } from '~/lib/theme-provider';

export default function PrivacyScreen() {
  const { colorScheme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Privacy' }} />
      <ScrollView
        className="flex-1 bg-background"
        style={{
          backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
        }}>
        <View className="mx-auto w-full max-w-3xl p-6">
          <Text
            className="mb-4 text-2xl font-bold text-foreground"
            style={{ color: colorScheme === 'dark' ? '#f3f4f6' : '#1f2937' }}>
            Privacy Policy
          </Text>
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
        </View>
      </ScrollView>
    </>
  );
}
