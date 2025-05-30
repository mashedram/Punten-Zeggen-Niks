export type RoleCard = {
  name: string;
  value: number;
  canAttack: boolean;
  beats: RoleCard[];
  image?: string;
  overwrites?: string[];
};

const vlag: RoleCard = {
  name: 'vlag',
  value: 0,
  image: require('@/assets/images/Vlag.png'),
  canAttack: false,
  beats: [],
};

const maarschalk: RoleCard = {
  name: 'maarschalk',
  value: 10,
  image: require('@/assets/images/Maarschalk.png'),
  canAttack: true,
  beats: [],
};

const generaal: RoleCard = {
  name: 'generaal',
  value: 9,
  image: require('@/assets/images/Generaal.png'),
  canAttack: true,
  beats: [],
};

const kolonel: RoleCard = {
  name: 'kolonel',
  value: 8,
  image: require('@/assets/images/Kolonel.png'),
  canAttack: true,
  beats: [],
};

const majoor: RoleCard = {
  name: 'majoor',
  value: 7,
  image: require('@/assets/images/Majoor.png'),
  canAttack: true,
  beats: [],
};

const kapitein: RoleCard = {
  name: 'kapitein',
  value: 6,
  image: require('@/assets/images/Kapitein.png'),
  canAttack: true,
  beats: [],
};

const luitenant: RoleCard = {
  name: 'luitenant',
  value: 5,
  image: require('@/assets/images/Luitenant.png'),
  canAttack: true,
  beats: [],
};

const sergeant: RoleCard = {
  name: 'sergeant',
  value: 4,
  image: require('@/assets/images/Sergeant.png'),
  canAttack: true,
  beats: [],
};

const mineur: RoleCard = {
  name: 'mineur',
  value: 3,
  image: require('@/assets/images/Mineur.png'),
  canAttack: true,
  beats: [],
};

const spion: RoleCard = {
  name: 'spion',
  value: 2,
  image: require('@/assets/images/Spion.png'),
  canAttack: true,
  beats: [],
};

const bom: RoleCard = {
  name: 'bom',
  value: 1,
  image: require('@/assets/images/Bom.png'),
  canAttack: false,
  beats: [],
};

maarschalk.beats = [
  generaal,
  kolonel,
  majoor,
  kapitein,
  luitenant,
  sergeant,
  mineur,
  spion,
];

generaal.beats = [
  kolonel,
  majoor,
  kapitein,
  luitenant,
  sergeant,
  mineur,
  spion,
];

kolonel.beats = [majoor, kapitein, luitenant, sergeant, mineur, spion];

majoor.beats = [kapitein, luitenant, sergeant, mineur, spion];

kapitein.beats = [luitenant, sergeant, mineur, spion];

luitenant.beats = [sergeant, mineur, spion];

sergeant.beats = [mineur, spion];

mineur.beats = [spion, bom];

spion.beats = [maarschalk];

bom.beats = [
  maarschalk,
  generaal,
  kolonel,
  majoor,
  kapitein,
  luitenant,
  sergeant,
  spion,
];

export const RoleCards: Record<string, RoleCard> = {
  vlag,
  maarschalk,
  generaal,
  kolonel,
  majoor,
  kapitein,
  luitenant,
  sergeant,
  mineur,
  spion,
  bom,
};
