import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { View } from 'react-native';

import { Spion } from '@/components/Spelersrollen/Spion';

const meta = {
  title: 'Player Page/Spion',
  component: Spion,
  decorators: [
    Story => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  // args: { onPress: fn() },
} satisfies Meta<typeof Spion>;

export default meta;

type Story = StoryObj<typeof meta>;

// export const Primary: Story = {
//   args: {},
// };
