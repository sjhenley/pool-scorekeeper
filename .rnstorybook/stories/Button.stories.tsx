import type { Meta, StoryObj } from '@storybook/react-native';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { View, Button as NativeButton } from 'react-native';
import { fn } from 'storybook/test';

import { Button } from '../../components/Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story) => {
      const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

      const setColorScheme = (scheme: 'light' | 'dark') => {
        colorScheme.set(scheme);
        setCurrentTheme(scheme);
      };
      return (
        <View className="flex-1 items-center justify-center bg-background-300 dark:bg-background-900 p-5 px-36 gap-10">
          <Story />
          <NativeButton
            title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
            onPress={() => setColorScheme(currentTheme === 'dark' ? 'light' : 'dark')}
          />
        </View>
      );
    }
  ],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // Use `fn` to spy on the onPress arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onPress: fn() }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true
  }
};

export const PrimaryTransparent: Story = {
  args: {
    label: 'Button',
    primary: true,
    transparent: true
  }
};

export const Secondary: Story = {
  args: {
    label: 'Button',
    primary: false
  }
};

export const SecondaryTransparent: Story = {
  args: {
    label: 'Button',
    primary: false,
    transparent: true
  }
};
