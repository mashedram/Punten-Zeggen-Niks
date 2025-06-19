export type RoleCard = {
  id: string;
  name: string;
  value: number;
  canAttack: boolean;
  beats: RoleCard[];
  overwrites?: string[];
};

const vlag: RoleCard = {
  id: 'vlag',
  name: 'Vlag',
  value: 0,
  canAttack: false,
  beats: [],
};

const maarschalk: RoleCard = {
  id: 'maarschalk',
  name: 'Maarschalk',
  value: 10,
  canAttack: true,
  beats: [],
};

const generaal: RoleCard = {
  id: 'generaal',
  name: 'Generaal',
  value: 9,
  canAttack: true,
  beats: [],
};

const kolonel: RoleCard = {
  id: 'kolonel',
  name: 'Kolonel',
  value: 8,
  canAttack: true,
  beats: [],
};

const majoor: RoleCard = {
  id: 'majoor',
  name: 'Majoor',
  value: 7,
  canAttack: true,
  beats: [],
};

const kapitein: RoleCard = {
  id: 'kapitein',
  name: 'Kapitein',
  value: 6,
  canAttack: true,
  beats: [],
};

const luitenant: RoleCard = {
  id: 'luitenant',
  name: 'Luitenant',
  value: 5,
  canAttack: true,
  beats: [],
};

const sergeant: RoleCard = {
  id: 'sergeant',
  name: 'Sergeant',
  value: 4,
  canAttack: true,
  beats: [],
};

const mineur: RoleCard = {
  id: 'mineur',
  name: 'Mineur',
  value: 3,
  canAttack: true,
  beats: [],
};

const spion: RoleCard = {
  id: 'spion',
  name: 'Spion',
  value: 2,
  canAttack: true,
  beats: [],
};

const bom: RoleCard = {
  id: 'bom',
  name: 'Bom',
  value: 1,
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

export const AllRoleCards: RoleCard[] = Object.values(RoleCards);
