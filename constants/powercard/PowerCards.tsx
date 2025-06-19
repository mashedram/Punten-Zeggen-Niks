import { PowerCard } from '@/common/stratego/powercard/PowerCard';

export const PowerCards = {
  kamikazi: {
    name: 'Kamikazi',
    description:
      'Verliest het spel, maar neemt de tegenstander mee in de dood.',
  },
} satisfies { [K: string]: PowerCard };
