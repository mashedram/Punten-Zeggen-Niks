import { z } from 'zod';
import { LOBBY_CONSTANTS, LobbyManager } from './LobbyManager';
import {
  ConnectionState,
  Player,
  playerDataSchema,
  PlayerEvent,
  priviligedPlayerDataSchema,
} from './Player';
import { PlayerToken } from './PlayerToken';
import {
  LobbyGameData,
  LobbyGameDataSchema,
} from '@/api/game/lobby/LobbyGameData';
import { GameType, GameTypes } from '@/api/game/GameType';

function generateRandomCode(length: number): string {
  let value = '';

  for (let i = 0; i < length; i++) {
    value += Math.floor(Math.random() * 9);
  }

  return value;
}

/**
 * A type that defines publicly shared data between server and client for a lobby
 */
export const lobbyDataSchema = z.object({
  code: z.string(),
  game: LobbyGameDataSchema,
  self: priviligedPlayerDataSchema,
  players: z.array(playerDataSchema),
});

export type LobbyData = z.infer<typeof lobbyDataSchema>;

export class Lobby {
  private manager: LobbyManager;

  code: string;
  private _gameType: GameType<never, never> | undefined;
  private _gameData: LobbyGameData = {
    gameId: undefined,
  };
  private _players: { [id: string]: Player } = {};
  private _playerIdCounter = 0;

  constructor(manager: LobbyManager) {
    this.manager = manager;
    this.code = generateRandomCode(LOBBY_CONSTANTS.LOBBY_CODE_LENGTH);
  }

  /**
   * Called when the lobby is about to be removed
   */
  public onRemoval(): void {
    for (const player of Object.values(this._players)) {
      player.onRemoval();
    }
  }

  // Player control methods

  public getCode(): string {
    return this.code;
  }

  public getGameType(): LobbyGameData {
    return this._gameData;
  }

  public setGame(gameId: string) {
    const type = GameTypes.find(g => g.id === gameId);
    if (!type) throw new Error('Game not found');
    this._gameType = type as GameType<never, never>;
    this._gameData = type.createLobbyData();
    for (const player of Object.values(this._players)) {
      player.setGameData(type.createPlayerData(player));
    }
    this.sync();
  }

  public getDataForPlayer(player: Player): LobbyData {
    return {
      code: this.code,
      game: this._gameData,
      self: player.getPrivilegedData(),
      players: this.getActivePlayers()
        .filter(p => p !== player)
        .map(p => p.getPublicData()),
    };
  }

  public createSyncEventFor(player: Player): PlayerEvent<LobbyData> {
    const data = this.getDataForPlayer(player);
    return {
      type: LOBBY_CONSTANTS.LOBBY_STATE_EVENT,
      content: data,
    };
  }

  public sync() {
    for (const player of this.getActivePlayers()) {
      const event = this.createSyncEventFor(player);
      player.emit(event);
    }
  }

  public syncWith(player: Player) {
    const event = this.createSyncEventFor(player);
    player.emit(event);
  }

  public syncOthers(player: Player) {
    for (const other of this.getActivePlayers()) {
      if (other === player) continue;
      const event = this.createSyncEventFor(other);
      other.emit(event);
    }
  }

  public getPlayer(playerToken: PlayerToken): Player | undefined {
    return Object.values(this._players).find(p =>
      p.checkAuthToken(playerToken.getPlayerAuthToken()),
    );
  }

  /**
   * @returns all players that are currently in the lobby and are active (connected, not inactive, etc.)
   */
  public getActivePlayers(): Player[] {
    return Object.values(this._players).filter(
      p => p.getConnectionState() === ConnectionState.Connected,
    );
  }

  public createPlayer(): Player {
    const id = this._playerIdCounter++;
    const player = new Player(id.toString(), false, this);
    if (this._gameType) {
      player.setGameData(this._gameType.createPlayerData(player));
    }
    this._players[player.getId()] = player;
    this.manager.emit('playerCreated', this, player);
    return player;
  }

  public removePlayer(id: string) {
    const player = this._players[id];
    if (!player) return;

    this.manager.emit('playerRemoving', this, player);
    player.onRemoval();
    delete this._players[id];

    if (Object.keys(this._players).length === 0) {
      this.manager.deleteLobby(this.getCode());
      return;
    }

    if (
      player.isAdmin() &&
      !Object.values(this._players).some(p => p.isAdmin())
    ) {
      const newAdmin = Object.values(this._players).find(p => !p.isAdmin());
      newAdmin?.setAdmin(true);
    }
  }
}
