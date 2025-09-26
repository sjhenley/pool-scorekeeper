import { useRouter } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components';

export default function Settings() {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(colorScheme.get() || 'system');
  const router = useRouter();

  const setColorScheme = (scheme: 'light' | 'dark' | 'system') => {
    colorScheme.set(scheme);
    setCurrentTheme(scheme);
  };

  return (
    <View className='flex-1 justify-center items-center bg-text-300 dark:bg-background-900 gap-5 p-5'>
      <Button
        primary
        size='lg'
        label="Go to Storybook"
        onPress={() => router.navigate('/storybook')} />
      <Button
        primary
        size='lg'
        label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
        onPress={() => setColorScheme(currentTheme === 'dark' ? 'light' : 'dark')}
      />
    </View>
  );
}
