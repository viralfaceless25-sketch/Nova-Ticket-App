import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      {/* ✅ Change style to "light" so time/battery are white on the blue header */}
      <StatusBar style="light" /> 
    </SafeAreaProvider>
  );
}