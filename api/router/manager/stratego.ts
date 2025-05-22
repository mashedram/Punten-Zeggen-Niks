import { lobbyManager } from '@/api/managers/lobby/LobbyManager';
import { PlayerToken } from '@/api/managers/lobby/PlayerToken';
import { StrategoGame } from '@/api/managers/statego/StrategoGame';
import { publicProcedure, router } from '@/api/server';
import { z } from 'zod';

export const strategoRouter = router({
  attack: publicProcedure
    .input(z.object({ token: z.string(), attackCode: z.string() }))
    .mutation(({ input }) => {
      const entity = lobbyManager.getPlayer(
        PlayerToken.fromString(input.token),
      );
      if (!entity) throw new Error('Lobby not found');
      const [lobby, attacker] = entity;
      StrategoGame.attack(lobby, attacker, input.attackCode);
    }),
});
