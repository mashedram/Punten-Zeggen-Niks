import { lobbyManager } from '@/api/managers/lobby/LobbyManager';
import {
  getLobbyData,
  getPlayerData,
  getPlayerFromAttackCode,
  StrategoGame,
} from '@/api/managers/stratego/StrategoGame';
import { publicProcedure, router } from '@/api/server';
import { PowerCardKeysType } from '@/constants/powercard/PowerCards';
import { PowerCards } from '@/constants/powercard/PowerCards';
import { RoleCardKeysType, RoleCards } from '@/constants/RoleCards';
import { z } from 'zod';

export const strategoRouter = router({
  attack: publicProcedure
    .input(z.object({ attackCode: z.string() }))
    .mutation(({ ctx, input }) => {
      const client = ctx.client;

      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) throw new Error('Lobby not found');
      const defender = getPlayerFromAttackCode(lobby, input.attackCode);
      if (!defender) throw new Error('Invalid attack code');
      StrategoGame.attack(lobby, player, defender);
    }),

  usePowerCard: publicProcedure
    .input(z.object({ index: z.number() }))
    .mutation(({ ctx, input }) => {
      const client = ctx.client;
      const [, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!player) throw new Error('Player not found');
      StrategoGame.usePowerCard(player, input.index);
    }),
  buyCardMutation: publicProcedure
    .input(
      z.object({
        targetId: z.string(),
        cardId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const client = ctx.client;
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }

      const targetPlayer = lobby
        .getPlayers()
        .find(p => p.getId() === input.targetId);
      if (!targetPlayer) {
        throw new Error(
          `Target player not found ${input.targetId}: stratego.buyCard`,
        );
      }

      const playerData = getPlayerData(player);
      const targetData = getPlayerData(targetPlayer);

      if (playerData.roleCard !== 'vlag') {
        throw new Error('Only players with a flag can buy cards.');
      }

      if (targetData.powercards.length >= 3) {
        throw new Error('Target player already has 3 power cards.');
      }

      if (!Object.keys(PowerCards).includes(input.cardId)) {
        throw new Error(`Power card ${input.cardId} does not exist.`);
      }

      const lobbyData = getLobbyData(lobby);
      const teams = lobbyData.teams;
      const team = teams.find(team => team.id === playerData.teamId);

      if (!team) {
        throw new Error('Team not found.');
      }

      const cardCost = PowerCards[input.cardId as PowerCardKeysType].cost;
      if (team.currency < cardCost) {
        throw new Error('Not enough currency to buy power card.');
      }

      const cards = targetData.powercards;
      cards.push(input.cardId as PowerCardKeysType);
      targetData.powercards = cards;
      team.currency -= cardCost;
      lobbyData.teams = teams;
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
      if (!lobby) throw new Error('Lobby not found');

      const lobbyData = getLobbyData(lobby);
      const roleCard = RoleCards[input.roleCard as RoleCardKeysType];
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
      if (targetData.teamId !== playerData.teamId)
        throw new Error('Target player is not on the same team.');
      if (
        Object.keys(
          lobbyData.teams.find(team => team.id === playerData.teamId)!.deck,
        ).length <= 0
      )
        throw new Error('Team has no role cards left to revive players.');

      const availableRoleCards = StrategoGame.getAvailableRoleCards(
        lobby,
        player,
      );
      if (!Object.keys(availableRoleCards).some(key => key === roleCard.id))
        throw new Error(
          `Role card ${roleCard.id} is not available in the team deck.`,
        );

      StrategoGame.revive(lobby, player, targetPlayer, roleCard);
    }),

  assignFlag: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const client = ctx.client;
    const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
    if (!lobby) throw new Error('Lobby not found');

    const targetPlayer = lobby.getPlayers().find(p => p.getId() === input);
    const playerData = getPlayerData(player);
    if (!targetPlayer)
      throw new Error(`Target player not found ${input}: stratego.assignFlag`);

    const targetData = getPlayerData(targetPlayer);
    if (!playerData.isTeamLeader)
      throw new Error('Only team leaders can assign flags.');
    if (targetData.roleCard)
      throw new Error(
        `Target player is already active. ${targetPlayer.getName()}`,
      );
    if (targetData.teamId !== playerData.teamId)
      throw new Error('Target player is not on the same team.');

    StrategoGame.assignFlag(lobby, player, targetPlayer);
  }),

  getAvailableRoleCards: publicProcedure
    .output(z.record(z.string(), z.number()))
    .query(({ ctx }) => {
      const client = ctx.client;
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) throw new Error('Lobby not found');

      return StrategoGame.getAvailableRoleCards(lobby, player);
    }),

  getPlayersWithoutRoleCards: publicProcedure
    .output(z.array(z.string()))
    .query(({ ctx }) => {
      const client = ctx.client;
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) throw new Error('Lobby not found');

      return StrategoGame.getPlayersWithoutRoleCards(lobby, player);
    }),

  getStatistics: publicProcedure.query(({ ctx }) => {
    const client = ctx.client;
    const [lobby] = lobbyManager.getClientLobbyAndPlayer(client);

    if (!lobby) throw new Error('Lobby not found');

    return lobby.getStatistics().getReport();
  }),
});
