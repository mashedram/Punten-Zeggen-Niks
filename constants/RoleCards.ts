export type RoleCard = {
  name: string;
  value: number;
  source?: string;
  overwrites?: string[];
};

export const RoleCards: Record<string, RoleCard> = {
  general: {
    name: 'Generaal',
    value: 10,
  },
  flag: {
    name: 'Vlag',
    value: 0,
  },
};
