import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { View } from 'react-native';

import { CreateButton } from '@/components/Home_page/CreateButton';


const meta = {
  title: 'Home page/CreateButton',
  component: CreateButton,
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
} satisfies Meta<typeof CreateButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
  },
};