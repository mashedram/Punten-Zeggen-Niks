import { lobbyManager, LobbyManager } from '@/api/managers/lobby/LobbyManager';
import { ConnectionState } from '@/api/managers/lobby/Player';
import { PlayerToken } from '@/api/managers/lobby/PlayerToken';
import { publicProcedure, router } from '@/api/server';
import z from 'zod';

export const lobbyRouter = router({
  joinLobby: publicProcedure
    .input(z.object({ code: z.string() }))
    .output(z.string())
    .mutation(({ input }) => {
      const lobby = lobbyManager.getLobby(input.code);
      if (!lobby) throw new Error('Lobby not found');

      const player = lobby.createPlayer();
      return player.getToken().toString();
    }),
  createLobby: publicProcedure.output(z.string()).mutation(() => {
    const lobby = lobbyManager.createLobby();
    const player = lobby.createPlayer();
    player.setAdmin(true);
    return player.getToken().toString();
  }),
  setGame: publicProcedure
    .input(z.object({ token: z.string(), gameId: z.string() }))
    .mutation(({ input }) => {
      const token = PlayerToken.fromString(input.token);
      const lobby = lobbyManager.getPlayerLobby(token);
      if (!lobby) throw new Error('Lobby not found');

      const player = lobby.getPlayer(token);
      if (!player) throw new Error('Player not found');
      if (!player.isAdmin()) throw new Error('Only admins can set the game');

      lobby.setGame(input.gameId);
      if (!lobby.getGameType()) throw new Error('Game not found');
      lobby.sync();
    }),
  listen: publicProcedure
    .input(z.object({ token: z.string() }))
    .subscription(async function* ({ input, signal }) {
      const token = PlayerToken.fromString(input.token);
      const lobby = lobbyManager.getPlayerLobby(token);
      if (!lobby) throw new Error('Lobby not found');

      const player = lobby.getPlayer(token);
      if (!player) throw new Error('Player not found');

      // We can't emit events before the listener starts, but we must emit a sync event before we can start listening as a client
      // Thus, this intermediary step is required
      yield lobby.createSyncEventFor(player);

      player.setConnected(ConnectionState.Connected);
      player.sync();

      if (signal) {
        signal.addEventListener('abort', () => {
          player.setConnected(ConnectionState.Disconnected);
          player.sync();
        });
      } else {
        console.warn(
          `No signal provided for player ${player.getId()} in lobby ${lobby.getCode()}`,
        );
      }

      for await (const [event] of player.listen(signal)) {
        yield event;
      }
    }),
});
