import type { Meta, StoryObj } from '@storybook/react-native';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { Button as NativeButton, View } from 'react-native';
import { fn } from 'storybook/test';
import { Card } from '../../components/Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  decorators: [
    (Story) => {
      const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

      const setColorScheme = (scheme: 'light' | 'dark') => {
        colorScheme.set(scheme);
        setCurrentTheme(scheme);
      };
      return (
        <View className="flex-1 items-center justify-center bg-background-300 dark:bg-background-900 p-5 gap-10">
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
  args: {
    onPress: fn(),
    image: require('../../assets/balls/8.png')
  }
  // Use `fn` to spy on the onPress arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EightBall: Story = {
  args: {
    title: '8 Ball',
    description: 'Shoot all your group balls then pocket the 8 ball',
    cta: 'Play Now',
    disabled: false
  }
};

export const Profile: Story = {
  args: {
    title: 'Profile',
    iconName: 'account-circle',
    description: 'View and edit your profile information',
    cta: 'Edit Profile',
    disabled: false
  }
};
