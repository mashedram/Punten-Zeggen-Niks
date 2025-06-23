export type RoleCard = {
  id: string;
  name: string;
  value: number;
  canAttack: boolean;
  forceWins?: string[];
  explodes?: boolean;
};

const vlag: RoleCard = {
  id: 'vlag',
  name: 'Vlag',
  value: 0,
  canAttack: false,
};

const maarschalk: RoleCard = {
  id: 'maarschalk',
  name: 'Maarschalk',
  value: 10,
  canAttack: true,
};

const generaal: RoleCard = {
  id: 'generaal',
  name: 'Generaal',
  value: 9,
  canAttack: true,
};

const kolonel: RoleCard = {
  id: 'kolonel',
  name: 'Kolonel',
  value: 8,
  canAttack: true,
};

const majoor: RoleCard = {
  id: 'majoor',
  name: 'Majoor',
  value: 7,
  canAttack: true,
};

const kapitein: RoleCard = {
  id: 'kapitein',
  name: 'Kapitein',
  value: 6,
  canAttack: true,
};

const luitenant: RoleCard = {
  id: 'luitenant',
  name: 'Luitenant',
  value: 5,
  canAttack: true,
};

const sergeant: RoleCard = {
  id: 'sergeant',
  name: 'Sergeant',
  value: 4,
  canAttack: true,
};

const mineur: RoleCard = {
  id: 'mineur',
  name: 'Mineur',
  value: 3,
  canAttack: true,
  forceWins: ['bom'],
};

const spion: RoleCard = {
  id: 'spion',
  name: 'Spion',
  value: 2,
  canAttack: true,
  forceWins: ['maarschalk'],
};

const bom: RoleCard = {
  id: 'bom',
  name: 'Bom',
  value: 11,
  canAttack: false,
  explodes: true,
};

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

export const AllRoleCards: RoleCard[] = Object.values(RoleCards);
