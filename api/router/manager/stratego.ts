import { lobbyManager } from '@/api/managers/lobby/LobbyManager';
import {
  getLobbyData,
  getPlayerData,
  StrategoGame,
} from '@/api/managers/stratego/StrategoGame';
import { publicProcedure, router } from '@/api/server';
import { RoleCards } from '@/constants/RoleCards';
import { z } from 'zod';

export const strategoRouter = router({
  attack: publicProcedure
    .input(z.object({ attackCode: z.string() }))
    .mutation(({ ctx, input }) => {
      const client = ctx.client;

      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) throw new Error('Lobby not found');

      StrategoGame.attack(lobby, player, input.attackCode);
    }),

  usePowerCard: publicProcedure
    .input(z.object({ index: z.number() }))
    .mutation(({ ctx, input }) => {
      const client = ctx.client;
      const [, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!player) throw new Error('Player not found');
      StrategoGame.usePowerCard(player, input.index);
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
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }
      const lobbyData = getLobbyData(lobby);
      const roleCard = RoleCards[input.roleCard];
      if (!roleCard) throw new Error('Invalid role card');
      const targetPlayer = lobby
        .getPlayers()
        .find(p => p.getId() === input.targetId);
      const playerData = getPlayerData(player);
      if (!playerData.isTeamLeader) {
        throw new Error('Only team leaders can revive players.');
      }

      if (!targetPlayer)
        throw new Error(`Target player not found ${input}: stratego.revive`);
      const targetData = getPlayerData(targetPlayer);
      if (targetData.roleCard) {
        throw new Error(
          `Target player is already active. ${targetPlayer.getName()}`,
        );
      }
      if (targetData.teamId !== playerData.teamId) {
        throw new Error('Target player is not on the same team.');
      }
      if (
        Object.keys(
          lobbyData.teams.find(team => team.id === playerData.teamId)!.deck,
        ).length <= 0
      ) {
        throw new Error('Team has no role cards left to revive players.');
      }
      const availableRoleCards = StrategoGame.getAvailableRoleCards(
        lobby,
        player,
      );
      if (!Object.keys(availableRoleCards).some(key => key === roleCard.id)) {
        throw new Error(
          `Role card ${roleCard.id} is not available in the team deck.`,
        );
      }
      StrategoGame.revive(lobby, player, targetPlayer, roleCard);
    }),

  assignFlag: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const client = ctx.client;
    const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
    if (!lobby) {
      throw new Error('Lobby not found');
    }
    const targetPlayer = lobby.getPlayers().find(p => p.getId() === input);
    const playerData = getPlayerData(player);
    if (!targetPlayer)
      throw new Error(`Target player not found ${input}: stratego.revive`);
    const targetData = getPlayerData(targetPlayer);
    if (!targetData.isTeamLeader) {
      throw new Error('Only team leaders can revive players.');
    }
    if (targetData.roleCard) {
      throw new Error(
        `Target player is already active. ${targetPlayer.getName()}`,
      );
    }
    if (targetData.teamId !== playerData.teamId) {
      throw new Error('Target player is not on the same team.');
    }
    StrategoGame.assignFlag(lobby, player, targetPlayer);
  }),

  getAvailableRoleCards: publicProcedure
    .output(z.record(z.string(), z.number()))
    .query(({ ctx }) => {
      const client = ctx.client;
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
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }
      return StrategoGame.getPlayersWithoutRoleCards(lobby, player);
    }),
});
