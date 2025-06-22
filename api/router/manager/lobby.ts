import { LobbyManager } from '@/api/managers/lobby/LobbyManager';
import { publicProcedure, router } from '@/api/server';
import { FirstNames } from '@/constants/FirstNames';
import z from 'zod';

const lobbyManager = new LobbyManager();

export const lobbyRouter = router({
  joinLobby: publicProcedure
    .input(z.object({ code: z.string(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      const lobby = lobbyManager.getLobby(input.code);
      if (!lobby) {
        throw new Error('Lobby not found');
      }

      lobby.createPlayer(input.name, ctx.client);
    }),
  createLobby: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      const lobby = lobbyManager.createLobby();
      console.log('Creating lobby');

      lobby.createPlayer(input.name, ctx.client);
    }),
  joinDevLobby: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(({ ctx, input }) => {
      if (!Bun.env.EXPO_PUBLIC_DEV_LOBBY_CODE) {
        console.error('Dev lobby code is not set');
        return;
      }

      if (Bun.env.EXPO_PUBLIC_DEV_LOBBY_CODE !== input.code) {
        throw new Error('Invalid dev lobby code');
      }
      let lobby = lobbyManager.getLobby(input.code);
      if (!lobby) {
        lobby = lobbyManager.createLobby(input.code);
      }

      const firstWord = FirstNames;
      const lastWord = ['Developer', 'Tester', 'Admin', 'User', 'Player'];
      const randomName = `${firstWord[Math.floor(Math.random() * firstWord.length)]} ${lastWord[Math.floor(Math.random() * lastWord.length)]}`;

      console.log('Joining dev lobby');
      lobby.createPlayer(randomName, ctx.client);
    }),
  setGame: publicProcedure
    .input(
      z.object({
        code: z.string(),
        gameId: z.string().nullable(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(ctx.client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }
      if (!player.isAdmin()) {
        throw new Error('Only lobby admins can set the game');
      }
      if (input.gameId === null) {
        lobby.clearGame();
        return;
      }
      lobby.setGame(input.gameId);
    }),
  setLeader: publicProcedure
    .input(
      z.object({
        target: z.string(),
        state: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(ctx.client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }
      if (!player.isAdmin()) {
        throw new Error('Only lobby admins can set the leader');
      }
      const target = lobby.getPlayer(input.target);
      if (!target) {
        throw new Error('Target player not found');
      }
      target.setLeader(input.state);
    }),
  leaveLobby: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const client = ctx.client;
      if (!client) throw new Error('Client not found');
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }
      lobby.removePlayer(player.getId());
    }),
});
