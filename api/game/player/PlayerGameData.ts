import { z } from 'zod';
import { StrategoPlayerGameDataSchema } from '@/api/managers/statego/StrategoGame';

export const PlayerGameDataSchema = z.discriminatedUnion('gameId', [
  z.object({
    gameId: z.undefined(),
  }),
  StrategoPlayerGameDataSchema,
]);
export type PlayerGameData = z.infer<typeof PlayerGameDataSchema>;
