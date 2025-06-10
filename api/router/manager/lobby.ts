import { LobbyManager } from '@/api/managers/lobby/LobbyManager';
import { publicProcedure, router } from '@/api/server';
import z from 'zod';

const lobbyManager = new LobbyManager();

export const lobbyRouter = router({
  joinLobby: publicProcedure
    .input(z.object({ code: z.string(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      const client = ctx.client;
      if (!client) throw new Error('Client not found');
      const lobby = lobbyManager.getLobby(input.code);
      if (!lobby) {
        throw new Error('Lobby not found');
      }

      lobby.createPlayer(input.name, client);
    }),
  createLobby: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      const client = ctx.client;
      if (!client) throw new Error('Client not found');
      const lobby = lobbyManager.createLobby();
      console.log('Creating lobby');

      lobby.createPlayer(input.name, client);
    }),
  setGame: publicProcedure
    .input(
      z.object({
        code: z.string(),
        gameId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const client = ctx.client;
      if (!client) throw new Error('Client not found');
      const [lobby, player] = lobbyManager.getClientLobbyAndPlayer(client);
      if (!lobby) {
        throw new Error('Lobby not found');
      }
      if (!player.isAdmin()) {
        throw new Error('Only lobby admins can set the game');
      }
      lobby.setGame(input.gameId);
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
