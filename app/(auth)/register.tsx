import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Mock auth - replace with real auth
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium">Full Name</Text>
            <Input placeholder="John Doe" value={name} onChangeText={setName} />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium">Email</Text>
            <Input
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium">Password</Text>
            <Input
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button label="Sign Up" onPress={handleRegister} className="mt-2" />

          <Button
            label="Already have an account? Sign In"
            variant="ghost"
            onPress={() => router.push('/(auth)/login')}
          />
        </CardContent>
      </Card>
    </View>
  );
}
