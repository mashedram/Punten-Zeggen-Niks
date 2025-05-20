import { z } from 'zod';
import { StrategoGameId } from '../GameType';

export const StategoPlayerGameDataSchema = z.object({
  gameId: z.literal(StrategoGameId),
  roleCard: z.string(),
});
export type StategoPlayerGameData = z.infer<typeof StategoPlayerGameDataSchema>;

export const PlayerGameDataSchema = z.discriminatedUnion('gameId', [
  z.object({
    gameId: z.literal(undefined),
  }),
  StategoPlayerGameDataSchema,
]);
export type PlayerGameData = z.infer<typeof PlayerGameDataSchema>;
