import { EventEmitter, on as on } from 'ws';
import { z } from 'zod';
import { PlayerToken } from './PlayerToken';
import { LOBBY_CONSTANTS } from './LobbyManager';
import { Lobby } from './Lobby';

/**
 * A type that defines a player event
 * @template T The content of the event, based on it's type
 */
export type PlayerEvent<T> = {
  id: number;
  type: string;
  content: T;
};

/**
 * A type that defines publicly shared data between server and client
 */
export const playerDataSchema = z.object({
  id: z.string(),
});

/**
 * An interface that defines data that is only available to the player themselves
 * Includes publicly available data
 */
export const priviligedPlayerDataSchema = playerDataSchema.extend({
  // Empty for future usage
});

// Create an extendable type of the schema to enforce it upon a class or somewhere else within TypeScript
export type PlayerData = z.infer<typeof playerDataSchema>;
export type PriviligedPlayerData = z.infer<typeof priviligedPlayerDataSchema>;

export enum ConnectionState {
  Connected,
  Disconnected,
}

export class Player {
  private id: string;
  private authToken: string;
  private lobby: Lobby;

  private connectionState: ConnectionState = ConnectionState.Disconnected;
  private disconnectTimeout: NodeJS.Timeout | null = null;
  // Event state
  private emitter: EventEmitter = new EventEmitter();
  private lastEventId: number = 0;

  constructor(id: string, lobby: Lobby) {
    this.id = id;
    this.authToken = crypto.randomUUID();
    this.lobby = lobby;
  }

  public getId(): string {
    return this.id;
  }

  public checkAuthToken(token: string): boolean {
    return this.authToken === token;
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
    this.lobby.syncOthers(this);
  }

  public getToken(): PlayerToken {
    return new PlayerToken(this.lobby.getCode(), this.authToken);
  }

  public setConnected(state: ConnectionState) {
    this.connectionState = state;

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = null;
    }

    if (state === ConnectionState.Disconnected) {
      this.disconnectTimeout = setTimeout(() => {
        this.lobby.removePlayer(this.getId());
      }, LOBBY_CONSTANTS.DISCONNECT_TIMEOUT_MS);
    }
  }

  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  public getPublicData(): PlayerData {
    return {
      id: this.id,
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
    event.id = ++this.lastEventId;
    this.emitter.emit('event', event);
  }
}
