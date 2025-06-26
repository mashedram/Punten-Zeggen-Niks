export type RoleCard = {
  id: string;
  name: string;
  value: number;
  canAttack: boolean;
  forceWins?: string[];
  points: number;
  explodes?: boolean;
};

const vlag: RoleCard = {
  id: 'vlag',
  name: 'Vlag',
  value: 0,
  canAttack: false,
  points: 0,
};

const maarschalk: RoleCard = {
  id: 'maarschalk',
  name: 'Maarschalk',
  value: 10,
  canAttack: true,
  points: 10,
};

const generaal: RoleCard = {
  id: 'generaal',
  name: 'Generaal',
  value: 9,
  canAttack: true,
  points: 9,
};

const kolonel: RoleCard = {
  id: 'kolonel',
  name: 'Kolonel',
  value: 8,
  canAttack: true,
  points: 8,
};

const majoor: RoleCard = {
  id: 'majoor',
  name: 'Majoor',
  value: 7,
  canAttack: true,
  points: 7,
};

const kapitein: RoleCard = {
  id: 'kapitein',
  name: 'Kapitein',
  value: 6,
  canAttack: true,
  points: 6,
};

const luitenant: RoleCard = {
  id: 'luitenant',
  name: 'Luitenant',
  value: 5,
  canAttack: true,
  points: 5,
};

const sergeant: RoleCard = {
  id: 'sergeant',
  name: 'Sergeant',
  value: 4,
  canAttack: true,
  points: 4,
};

const mineur: RoleCard = {
  id: 'mineur',
  name: 'Mineur',
  value: 3,
  canAttack: true,
  forceWins: ['bom'],
  points: 3,
};

const spion: RoleCard = {
  id: 'spion',
  name: 'Spion',
  value: 2,
  canAttack: true,
  forceWins: ['maarschalk'],
  points: 2,
};

const bom: RoleCard = {
  id: 'bom',
  name: 'Bom',
  value: 11,
  canAttack: false,
  points: 1,
  explodes: true,
};

export const RoleCards = {
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
} satisfies Record<string, RoleCard>;

export type RoleCardKeysType = keyof typeof RoleCards;

export const RoleCardKeys = Object.fromEntries(
  Object.keys(RoleCards).map(value => [value, value]),
) as Record<RoleCardKeysType, RoleCardKeysType>;

export const AllRoleCards: RoleCard[] = Object.values(RoleCards);
