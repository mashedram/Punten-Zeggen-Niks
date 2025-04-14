import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { View } from 'react-native';

import { SpelersLijst } from '@/components/lobby_host/SpelersLijst';

const meta = {
  title: 'Lobby/SpelersLijst',
  component: SpelersLijst,
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
  args: {},
} satisfies Meta<typeof SpelersLijst>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
  speler: "" 
  },
};