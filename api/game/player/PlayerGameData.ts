import { z } from 'zod';
import { PlayerDataSchemaStratego } from '@/api/managers/statego/StrategoGame';

export const PlayerGameDataSchema = z.discriminatedUnion('gameId', [
  z.object({
    gameId: z.undefined(),
  }),
  PlayerDataSchemaStratego,
]);
export type PlayerGameData = z.infer<typeof PlayerGameDataSchema>;
