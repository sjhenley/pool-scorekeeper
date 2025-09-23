import { useRouter } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const setColorScheme = (scheme: 'light' | 'dark') => {
    colorScheme.set(scheme);
    setCurrentTheme(scheme);
  };

  return (
    <LinearGradient
      colors={
        currentTheme === 'dark'
          ? ['#060e23', '#3a5dd9']
          : ['#4788C4', '#A8A8A8']
      }
      start={{ x: 0.5, y: 0.4 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1 justify-center items-center gap-10 p-5">
      <Text className="text-6xl font-sans font-bold text-text-900 dark:text-text-100">Scorekeeper</Text>
      <Button primary onPress={() => router.navigate('/storybook')} label="Go to Storybook" />
      <Button
        label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
        onPress={() => setColorScheme(currentTheme === 'dark' ? 'light' : 'dark')}
      />
    </LinearGradient>
  );
}
