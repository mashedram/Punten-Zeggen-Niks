import { z } from 'zod';
import { StrategoGameId } from '../GameType';

export const StategoLobbyGameDataSchema = z.object({
  gameId: z.literal(StrategoGameId),
});
export type StategoLobbyGameData = z.infer<typeof StategoLobbyGameDataSchema>;

export const LobbyGameDataSchema = z.discriminatedUnion('gameId', [
  z.object({
    gameId: z.literal(undefined),
  }),
  StategoLobbyGameDataSchema,
]);

export type LobbyGameData = z.infer<typeof LobbyGameDataSchema>;
