import { lobbyManager } from '@/api/managers/lobby/LobbyManager';
import { StrategoGame } from '@/api/managers/stratego/StrategoGame';
import { publicProcedure, router } from '@/api/server';
import { RoleCards } from '@/constants/RoleCards';
import { z } from 'zod';

export const strategoRouter = router({
  attack: publicProcedure
    .input(z.object({ attackCode: z.string() }))
    .mutation(({ ctx, input }) => {
      const client = ctx.client;
      if (!client) throw new Error('Client not found');

      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) throw new Error('Lobby not found');

      StrategoGame.attack(lobby, player, input.attackCode);
    }),

  revive: publicProcedure
    .input(
      z.object({
        targetId: z.string(),
        roleCard: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const client = ctx.client;
      if (!client) throw new Error('Client not found');
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }

      const roleCard = RoleCards[input.roleCard];
      if (!roleCard) throw new Error('Invalid role card');
      const targetPlayer = lobby
        .getPlayers()
        .find(p => p.getId() === input.targetId);
      if (!targetPlayer)
        throw new Error(
          `Target player not found ${input.targetId}: stratego.revive`,
        );
      StrategoGame.revive(lobby, player, targetPlayer, roleCard);
    }),

  getAvailableRoleCards: publicProcedure
    .output(z.record(z.string(), z.number()))
    .query(({ ctx }) => {
      const client = ctx.client;
      if (!client) throw new Error('Client not found');
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }
      return StrategoGame.getAvailableRoleCards(lobby, player);
    }),

  getPlayersWithoutRoleCards: publicProcedure
    .output(z.array(z.string()))
    .query(({ ctx }) => {
      const client = ctx.client;
      if (!client) throw new Error('Client not found');
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }
      return StrategoGame.getPlayersWithoutRoleCards(lobby, player);
    }),
});
