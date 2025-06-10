import { lobbyManager } from '@/api/managers/lobby/LobbyManager';
import { PlayerToken } from '@/api/managers/lobby/PlayerToken';
import { StrategoGame } from '@/api/managers/statego/StrategoGame';
import { publicProcedure, router } from '@/api/server';
import { RoleCards } from '@/constants/RoleCards';
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

  revive: publicProcedure
    .input(
      z.object({
        token: z.string(),
        targetId: z.string(),
        roleCard: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const roleCard = RoleCards[input.roleCard];
      if (!roleCard) throw new Error('Invalid role card');
      const entity = lobbyManager.getPlayer(
        PlayerToken.fromString(input.token),
      );
      if (!entity) throw new Error('Lobby not found');
      const [lobby, teamLeader] = entity;
      const targetPlayer = lobby
        .getPlayers()
        .find(p => p.getId() === input.targetId);
      if (!targetPlayer)
        throw new Error('Target player not found: stratego.revive');
      StrategoGame.revive(lobby, teamLeader, targetPlayer, roleCard);
    }),

  getAvailableRoleCards: publicProcedure
    .output(z.record(z.string(), z.number()))
    .input(z.object({ token: z.string() }))
    .query(({ input }) => {
      const entity = lobbyManager.getPlayer(
        PlayerToken.fromString(input.token),
      );
      if (!entity) throw new Error('Lobby not found');
      const [lobby, player] = entity;
      return StrategoGame.getAvailableRoleCards(lobby, player);
    }),

  getPlayersWithoutRoleCards: publicProcedure
    .output(z.array(z.string()))
    .input(z.object({ token: z.string() }))
    .query(({ input }) => {
      const entity = lobbyManager.getPlayer(
        PlayerToken.fromString(input.token),
      );
      if (!entity) throw new Error('Lobby not found');
      const [lobby, player] = entity;
      return StrategoGame.getPlayersWithoutRoleCards(lobby, player);
    }),
});
