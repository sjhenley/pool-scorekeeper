import type { Meta, StoryObj } from '@storybook/react-native';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { Button as NativeButton, View } from 'react-native';
import { fn } from 'storybook/test';
import { Carousel } from '../../components/Carousel';

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
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
  ],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  args: {
    data: [
      { title: '8 Ball', description: 'Shoot all your group balls then pocket the 8 ball', cta: 'Play Now', image: require('../../assets/balls/8.png'), onPress: fn() },
      { title: '9 Ball', description: 'Shoot balls in order from 1 to 9', cta: 'Play Now', image: require('../../assets/balls/9.png') },
      { title: 'Profile', description: 'View your profile', cta: 'View Profile', iconName: 'account-circle' },
      { title: 'Practice', description: 'Play solo to improve your skills', cta: 'Start Practice', iconName: 'trending-up' }
    ]
  }
  // Use `fn` to spy on the onPress arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EightBall: Story = {};
