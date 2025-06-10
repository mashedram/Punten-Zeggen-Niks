import { LobbyDataSchemaStratego } from '@/api/managers/stratego/StrategoGame';
import { z } from 'zod';

export const LobbyGameDataSchema = z.discriminatedUnion('gameId', [
  z.object({
    gameId: z.literal(undefined),
  }),
  LobbyDataSchemaStratego,
]);

export type LobbyGameData = z.infer<typeof LobbyGameDataSchema>;
