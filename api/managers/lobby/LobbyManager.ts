import EventEmitter from 'events';
import { Lobby } from './Lobby';
import { PlayerToken } from './PlayerToken';

type LobbyEventMap = {
  lobbyCreated: [lobby: Lobby];
  lobbyRemoving: [lobby: Lobby];
  playerCreated: [lobby: Lobby, player: Player];
  playerRemoving: [lobby: Lobby, player: Player];
};

export const LOBBY_CONSTANTS = {
  LOBBY_CODE_LENGTH: 6,
  DISCONNECT_TIMEOUT_MS: 5 * 1000,
  LOBBY_STATE_EVENT: 'lobby-state',
};

export class LobbyManager extends EventEmitter<LobbyEventMap> {
  private lobbies: { [key: string]: Lobby } = {};

  public createLobby(): Lobby {
    const lobby = new Lobby(this);
    this.lobbies[lobby.getCode()] = lobby;
    this.emit('lobbyCreated', lobby);

    return lobby;
  }

  public getLobby(code: string): Lobby | undefined {
    return this.lobbies[code];
  }

  public deleteLobby(code: string): void {
    const lobby = this.lobbies[code];
    if (!lobby) return;

    this.emit('lobbyRemoving', lobby);

    lobby.onRemoval();
    delete this.lobbies[code];
  }

  public getPlayerLobby(token: PlayerToken): Lobby | undefined {
    const lobby = this.getLobby(token.getLobbyCode());

    return lobby;
  }
}

export const lobbyManager = new LobbyManager();
