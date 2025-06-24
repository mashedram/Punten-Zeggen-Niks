import { PowerCard } from '@/common/stratego/powercard/PowerCard';

export const PowerCards = {
  kamikazi: {
    name: 'Kamikaze',
    description:
      'Je rol heeft nu de zelfde regels als een Bom. Jij en je tegenstander exploderen maar een Mineur kan niet je ontmantelen.',
    cost: 15,
  },
  ruilkaart: {
    name: 'Ruilkaart',
    description: 'Ruil je huidige rol met de rol van iemand binnen je team.',
    cost: 300,
  },
} satisfies { [K: string]: PowerCard };
