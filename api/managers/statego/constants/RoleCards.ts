export type RoleCard = {
  name: string;
  value: number;
  overwrites?: string[];
};

export const RoleCards: Record<string, RoleCard> = {
  general: {
    name: 'Generaal',
    value: 10,
  },
};
