import { useRouter } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';

export default function Index() {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const setColorScheme = (scheme: 'light' | 'dark') => {
    colorScheme.set(scheme);
    setCurrentTheme(scheme);
  };

  return (
    <View className="bg-light-background dark:bg-dark-background flex-1 justify-center items-center gap-10 p-5">
      <Text className="text-6xl font-sans font-bold text-light-text dark:text-dark-text">Scorekeeper</Text>
      <Button primary onPress={() => router.navigate('/storybook')} label="Go to Storybook" />
      <Button
        label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
        onPress={() => setColorScheme(currentTheme === 'dark' ? 'light' : 'dark')}
      />
    </View>
  );
}
