export type RoleCard = {
  name: string;
  value: number;
  image?: string;
  overwrites?: string[];
};

export const RoleCards: Record<string, RoleCard> = {
  vlag: {
    name: 'vlag',
    value: 0,
    image: require('@/assets/images/Vlag.png'),
  },
  maarschalk: {
    name: 'maarschalk',
    value: 10,
    image: require('@/assets/images/Maarschalk.png'),
  },
  generaal: {
    name: 'generaal',
    value: 9,
    image: require('@/assets/images/Generaal.png'),
  },
  kolonel: {
    name: 'kolonel',
    value: 8,
    image: require('@/assets/images/Kolonel.png'),
  },
  majoor: {
    name: 'majoor',
    value: 7,
    image: require('@/assets/images/Majoor.png'),
  },
  kapitein: {
    name: 'kapitein',
    value: 6,
    image: require('@/assets/images/Kapitein.png'),
  },
  luitenant: {
    name: 'luitenant',
    value: 5,
    image: require('@/assets/images/Luitenant.png'),
  },
  sergeant: {
    name: 'sergeant',
    value: 4,
    image: require('@/assets/images/Sergeant.png'),
  },
  mineur: {
    name: 'mineur',
    value: 3,
    image: require('@/assets/images/Mineur.png'),
  },
  spion: {
    name: 'spion',
    value: 2,
    image: require('@/assets/images/Spion.png'),
  },
  bom: {
    name: 'bom',
    value: 1,
    image: require('@/assets/images/Bom.png'),
  },
};
