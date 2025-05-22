import { StrategoLobbyGameDataSchema } from '@/api/managers/statego/StrategoGame';
import { z } from 'zod';

export const LobbyGameDataSchema = z.discriminatedUnion('gameId', [
  z.object({
    gameId: z.literal(undefined),
  }),
  StrategoLobbyGameDataSchema,
]);

export type LobbyGameData = z.infer<typeof LobbyGameDataSchema>;
