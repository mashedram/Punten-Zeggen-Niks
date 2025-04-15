import { LobbyManager } from '@/api/managers/lobby/LobbyManager';
import { ConnectionState } from '@/api/managers/lobby/Player';
import { PlayerToken } from '@/api/managers/lobby/PlayerToken';
import { publicProcedure, router } from '@/api/server';
import z from 'zod';

const manager = new LobbyManager();

export const lobbyRouter = router({
  joinLobby: publicProcedure
    .input(z.object({ code: z.string() }))
    .output(z.string())
    .mutation(({ input }) => {
      const lobby = manager.getLobby(input.code);
      if (!lobby) throw new Error('Lobby not found');

      const player = lobby.createPlayer();
      return player.getToken().toString();
    }),
  createLobby: publicProcedure.output(z.string()).mutation(() => {
    const lobby = manager.createLobby();
    return lobby.createPlayer().getToken().toString();
  }),
  listen: publicProcedure
    .input(z.object({ token: z.string() }))
    .subscription(async function* ({ input, signal }) {
      let player = manager.getPlayer(PlayerToken.fromString(input.token));
      if (!player) throw new Error('Player not found');

      yield player.createEvent(
        'lobby-state',
        player.getLobby().getDataForPlayer(player),
      );

      player.setConnected(ConnectionState.Connected);
      player.sync();

      if (signal) {
        signal.addEventListener('abort', () => {
          player.setConnected(ConnectionState.Disconnected);
          player.sync();
        });
      } else {
        console.warn(
          `No signal provided for player ${player.getId()} in lobby ${player.getLobby().getCode()}`,
        );
      }

      for await (const [event] of player.listen(signal)) {
        yield event;
      }
    }),
});
