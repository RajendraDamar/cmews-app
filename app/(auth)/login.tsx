import { View, Text, TextInput } from 'react-native';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock auth - replace with real auth
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <Text className="mb-8 text-3xl font-bold text-foreground">Welcome Back</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="mb-4 rounded-lg border border-border px-4 py-3 text-foreground"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="mb-6 rounded-lg border border-border px-4 py-3 text-foreground"
        placeholderTextColor="#999"
      />

      <Button label="Sign In" onPress={handleLogin} />

      <Button
        label="Create Account"
        variant="ghost"
        onPress={() => router.push('/(auth)/register')}
        className="mt-4"
      />
    </View>
  );
}
