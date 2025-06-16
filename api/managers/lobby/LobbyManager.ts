import { Lobby } from './Lobby';
import { Client } from '@/common/networking/client/Client';
import { Player } from './Player';

export const LOBBY_CONSTANTS = {
  LOBBY_CODE_LENGTH: 6,
  DISCONNECT_TIMEOUT_MS: 5 * 1000,
  LOBBY_STATE_EVENT: 'lobby-state',
};

export class LobbyManager {
  private lobbies: { [key: string]: Lobby } = {};

  public createLobby(): Lobby {
    const lobby = new Lobby(this);
    this.lobbies[lobby.getCode()] = lobby;
    return lobby;
  }

  public getLobby(code: string): Lobby | undefined {
    return this.lobbies[code];
  }

  public getClientLobbyAndPlayer(
    client: Client,
  ): [Lobby, Player] | [undefined, undefined] {
    const data = client.getData();
    if (!data.lobby) return [undefined, undefined];
    const lobby = data.lobby;
    return [lobby.lobby, lobby.player];
  }

  public deleteLobby(code: string): void {
    const lobby = this.lobbies[code];
    if (!lobby) return;
    lobby.onRemoval();
    delete this.lobbies[code];
  }
}

export const lobbyManager = new LobbyManager();
