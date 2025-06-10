import { LobbyStateUnsafe, useLobby } from './useLobby';

export function useLobbyUnsafe(): LobbyStateUnsafe {
  const lobby = useLobby();

  if (lobby.loading) {
    throw new Error('Lobby is loading');
  }
  if (!lobby.inLobby) {
    throw new Error('Not in lobby');
  }
  return lobby as LobbyStateUnsafe;
}
