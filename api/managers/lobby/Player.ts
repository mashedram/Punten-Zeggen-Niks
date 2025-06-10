import { EventEmitter, on as on } from 'ws';
import { z } from 'zod';
import { PlayerToken } from './PlayerToken';
import { LOBBY_CONSTANTS } from './LobbyManager';
import { Lobby } from './Lobby';
import {
  PlayerGameData as PlayerGameData,
  PlayerGameDataSchema as PlayerGameDataSchema,
} from '@/api/game/player/PlayerGameData';

/**
 * A type that defines a player event
 * @template T The content of the event, based on it's type
 */
export type PlayerEvent<T> = {
  type: string;
  content: T;
};

/**
 * A type that defines publicly shared data between server and client
 */
export const playerDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  isAdmin: z.boolean(),
  gameData: PlayerGameDataSchema,
});

/**
 * An interface that defines data that is only available to the player themselves
 * Includes publicly available data
 */
export const priviligedPlayerDataSchema = playerDataSchema.extend({
  // Empty for future usage
});

export type PlayerData = z.infer<typeof playerDataSchema>;
export type PriviligedPlayerData = z.infer<typeof priviligedPlayerDataSchema>;
export enum ConnectionState {
  Connected,
  Disconnected,
}

export class Player {
  private _id: string;
  private _authToken: string;
  private _name: string;
  private _isAdmin: boolean;
  private _lobby: Lobby;

  private _gameData: PlayerGameData = {
    gameId: undefined,
  };

  private connectionState: ConnectionState = ConnectionState.Disconnected;
  private disconnectTimeout: NodeJS.Timeout | null = null;

  private emitter: EventEmitter = new EventEmitter();

  constructor(id: string, name: string, isAdmin: boolean, lobby: Lobby) {
    this._id = id;
    this._name = name;
    this._isAdmin = isAdmin;
    this._authToken = crypto.randomUUID();
    this._lobby = lobby;
  }

  public getId(): string {
    return this._id;
  }

  public getName(): string {
    return this._name;
  }

  public getLobby(): Lobby {
    return this._lobby;
  }

  public checkAuthToken(token: string): boolean {
    return this._authToken === token;
  }

  public setGameData(gameData: PlayerGameData) {
    this._gameData = gameData;
  }

  public getGameData<T extends PlayerGameData>(): T {
    return this._gameData as T;
  }

  /**
   * Called when the player is about to be removed
   */
  public onRemoval(): void {
    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = null;
    }
  }

  public sync(): void {
    this._lobby.syncWith(this);
  }

  public syncToOthers(): void {
    this._lobby.syncOthers(this);
  }

  public getToken(): PlayerToken {
    return new PlayerToken(this._lobby.getCode(), this._authToken);
  }

  public isAdmin(): boolean {
    return this._isAdmin;
  }

  public setAdmin(value: boolean) {
    this._isAdmin = value;
  }

  public setConnected(state: ConnectionState) {
    this.connectionState = state;

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = null;
    }

    if (state === ConnectionState.Disconnected) {
      this.disconnectTimeout = setTimeout(() => {
        this._lobby.removePlayer(this.getId());
      }, LOBBY_CONSTANTS.DISCONNECT_TIMEOUT_MS);
    }
  }

  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  public getPublicData(): PlayerData {
    return {
      id: this._id,
      name: this._name,
      isAdmin: this._isAdmin,
      gameData: this._gameData,
    };
  }

  public getPrivilegedData(): PriviligedPlayerData {
    return {
      ...this.getPublicData(),
    };
  }

  public listen(
    signal?: AbortSignal,
  ): NodeJS.AsyncIterator<PlayerEvent<unknown>[]> {
    return on(this.emitter, 'event', {
      signal,
    });
  }

  public emit<T>(event: PlayerEvent<T>) {
    this.emitter.emit('event', event);
  }
}
