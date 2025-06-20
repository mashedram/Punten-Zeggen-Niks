import { PowerCard } from '@/common/stratego/powercard/PowerCard';

export const PowerCards = {
  kamikazi: {
    name: 'Kamikazi',
    description:
      'Verliest het spel, maar neemt de tegenstander mee in de dood.',
    cost: 15,
  },
  ruilkaart: {
    name: 'Ruilkaart',
    description: 'Ruil van plaats met een andere speler.',
    cost: 300,
  },
} satisfies { [K: string]: PowerCard };
