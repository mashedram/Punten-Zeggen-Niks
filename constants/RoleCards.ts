export type RoleCard = {
  name: string;
  value: number;
  image?: string;
  overwrites?: string[];
};

export const RoleCards: Record<string, RoleCard> = {
  flag: {
    name: 'Vlag',
    value: 0,
    image: require('@/assets/images/Vlag.png'),
  },
  maarschalk: {
    name: 'Maarschalk',
    value: 10,
    image: require('@/assets/images/Maarschalk.png'),
  },
  general: {
    name: 'Generaal',
    value: 9,
    image: require('@/assets/images/Generaal.png'),
  },
  kolonel: {
    name: 'Kolonel',
    value: 8,
    image: require('@/assets/images/Kolonel.png'),
  },
  majoor: {
    name: 'Majoor',
    value: 7,
    image: require('@/assets/images/Majoor.png'),
  },
  kapitein: {
    name: 'Kapitein',
    value: 6,
    image: require('@/assets/images/Kapitein.png'),
  },
  luitenant: {
    name: 'Luitenant',
    value: 5,
    image: require('@/assets/images/Luitenant.png'),
  },
  sergeant: {
    name: 'Sergeant',
    value: 4,
    image: require('@/assets/images/Sergeant.png'),
  },
  mineur: {
    name: 'Mineur',
    value: 3,
    image: require('@/assets/images/Mineur.png'),
  },
  spion: {
    name: 'Spion',
    value: 2,
    image: require('@/assets/images/Spion.png'),
  },
  bom: {
    name: 'Bom',
    value: 1,
    image: require('@/assets/images/Bom.png'),
  },
};
