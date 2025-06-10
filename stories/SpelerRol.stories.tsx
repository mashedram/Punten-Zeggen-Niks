import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { View } from 'react-native';

import { PlayerRole } from '@/components/Spelersrollen/PlayerRole';

const meta = {
  title: 'Player Page/PlayerRole',
  component: PlayerRole,
  decorators: [
    Story => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  // args: { onPress: fn() },
} satisfies Meta<typeof PlayerRole>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    actie: 'Spion',
    image: require('@/assets/images/spion.png'),
    code: 'SPION',
  },
};
