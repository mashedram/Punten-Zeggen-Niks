import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { View } from 'react-native';

import { Scherm2 } from '@/components/Home_page/HomePageScherm';

const meta = {
  title: 'Home Page/HomePageScherm',
  component: Scherm2,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // Use `fn` to spy on the onPress arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onPress: fn() },
} satisfies Meta<typeof Scherm2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
  },
};