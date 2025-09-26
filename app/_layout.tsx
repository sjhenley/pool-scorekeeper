import { Stack } from 'expo-router';
import '../global.css';
import { useColorScheme } from 'nativewind';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: true,
        headerStyle: {
          backgroundColor: colorScheme.colorScheme === 'dark' ? '#a2a5c3' : '#50547c'
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 28,
          fontWeight: 'bold',
          color: colorScheme.colorScheme === 'dark' ? '#1e1e2f' : '#e4e4e6',
          fontFamily: 'sans'
        }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="player-list" options={{ title: 'Player List' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="storybook" options={{ headerShown: false }} />
    </Stack>
  );
}
