import { PowerCard } from '@/common/stratego/powercard/PowerCard';

export const PowerCards = {
  kamikazi: {
    name: 'Kamikaze',
    description:
      'Je rol heeft nu de zelfde regels als een Bom. Jij en je tegenstander exploderen maar een Mineur kan niet je ontmantelen.',
    cost: 10,
  },
  bomvest: {
    name: 'Bomvest',
    description: 'Bescherm jezelf tegen 1 bom',
    cost: 10,
  },
  strongarm: {
    name: 'Goed getraind',
    description:
      'Als je tegen een speler met dezelfde kaart als jijzelf speelt, dan wint jij het gevegt!',
    cost: 5,
  },
} satisfies { [K: string]: PowerCard };

export type PowerCardKeysType = keyof typeof PowerCards;

export const PowerCardKeys = Object.fromEntries(
  Object.keys(PowerCards).map(value => [value, value]),
) as Record<PowerCardKeysType, PowerCardKeysType>;
