import type { Meta } from '@storybook/react-native';
import { colorScheme } from 'nativewind';
import { Button as NativeButton, View } from 'react-native';
import { useState } from 'react';
import { HomePage } from './HomePage';

export default {
  title: 'Pages/Home',
  component: HomePage,
  decorators: [
    (Story) => {
      const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

      const setColorScheme = (scheme: 'light' | 'dark') => {
        colorScheme.set(scheme);
        setCurrentTheme(scheme);
      };
      return (
        <View className="flex-1 items-center justify-center bg-background-300 dark:bg-background-900 gap-10">
          <Story />
          <NativeButton
            title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
            onPress={() => setColorScheme(currentTheme === 'dark' ? 'light' : 'dark')}
          />
        </View>
      );
    }
  ]
} as Meta<typeof HomePage>;

export const Default = {};
