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
        },
        headerTintColor: colorScheme.colorScheme === 'dark' ? '#1e1e2f' : '#e4e4e6'
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="players/index" options={{ title: 'Player List' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="storybook" options={{ headerShown: false }} />
      <Stack.Screen name="new-game" options={{ title: 'New Game' }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
    </Stack>
  );
}
