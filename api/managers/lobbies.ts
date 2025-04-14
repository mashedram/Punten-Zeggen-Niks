import { EventEmitter, on } from "ws";
import { z } from "zod";

function generateRandomCode(length: number): string {
  let value = "";

  for (let i = 0; i < length; i++) {
    value += Math.floor(Math.random() * 9);
  }

  return value;
}

const LOBBY_CODE_LENGTH = 6;
const DISCONNECT_TIMEOUT_MS = 5 * 1000;

export type PlayerEvent<T> = {
  id: number;
  type: string;
  content: T;
};

export class PlayerToken {
  private lobbyCode: string;
  private playerId: string;

  constructor(lobbyCode: string, playerId: string) {
    this.lobbyCode = lobbyCode;
    this.playerId = playerId;
  }

  public static fromPlayer(player: Player) {
    return new PlayerToken(player.getLobby().getCode(), player.getId());
  }

  public static fromString(token: string) {
    const [lobbyCode, playerId] = token.split("|");
    return new PlayerToken(lobbyCode, playerId);
  }

  public toString(): string {
    return `${this.lobbyCode}|${this.playerId}`;
  }

  public getLobbyCode(): string {
    return this.lobbyCode;
  }

  public getPlayerId(): string {
    return this.playerId;
  }
}

/**
 * A type that defines publicly shared data between server and client
 */
export const playerDataSchema = z.object({
  id: z.string(),
})

/**
 * An interface that defines data that is only available to the player themselves
 * Includes publicly available data
 */
export const priviligedPlayerDataSchema = playerDataSchema.extend({
  token: z.string(),
})

// Create an extendable type of the schema to enforce it upon a class or somewhere else within TypeScript
export type PlayerData = z.infer<typeof playerDataSchema>
export type PriviligedPlayerData = z.infer<typeof priviligedPlayerDataSchema>

export enum ConnectionState {
  Connected,
  Disconnected
}

export class Player implements PlayerData {
  /// The public ID of the player
  id: string;
  /// The private token used by the client to get privileged data
  private token: string;
  private lobby: Lobby;
  // Connection state
  // The last timestamp on which an action was done
  private connectionState: ConnectionState = ConnectionState.Disconnected;
  private lastConnectedTime: Date = new Date();
  private disconnectTimeout: NodeJS.Timeout | null = null;
  // Event state
  private emitter: EventEmitter = new EventEmitter();
  private lastEventId: number = 0;

  constructor(id: string, lobby: Lobby) {
    this.id = id;
    this.token = crypto.randomUUID();
    this.lobby = lobby;
  }

  public getId(): string {
    return this.id;
  }

  /**
   * Called when the player is about to be removed
   */
  public removing(): void {
    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = null;
    }
  }

  public getToken(): PlayerToken {
    return PlayerToken.fromPlayer(this);
  }

  public getLobby(): Lobby {
    return this.lobby;
  }

  public setConnected(state: ConnectionState) {
    this.connectionState = state;
    this.lastConnectedTime = new Date();

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = null;
    }

    if (state === ConnectionState.Disconnected) {
      this.disconnectTimeout = setTimeout(() => {
        this.lobby.removePlayer(this.getId())
      }, DISCONNECT_TIMEOUT_MS);
    }
  }

  public getPublicData(): PlayerData {
    return {
      id: this.id,
    };
  }

  public getPrivilegedData(): PriviligedPlayerData {
    return {
      ...this.getPublicData(),
      token: this.token,
    };
  }

  public createEvent<T>(type: string, content: T): PlayerEvent<T> {
    return {
      id: ++this.lastEventId,
      type,
      content,
    };
  }

  public on(signal?: AbortSignal): NodeJS.AsyncIterator<PlayerEvent<unknown>[]> {
    return on(this.emitter, "event", {
      signal
    });
  }

  public emit<T>(type: string, content: T) {
    const event = this.createEvent(type, content);
    this.emitter.emit("event", event);
  }
}

class Lobby {
  // Keep a reference to the manager that created this lobby instance
  private manager: LobbyManager;

  private code: string;
  private players: { [id: string]: Player } = {};
  private playerIdCounter = 0;

  constructor(manager: LobbyManager) {
    this.manager = manager;
    this.code = generateRandomCode(LOBBY_CODE_LENGTH);
  }

  /**
   * Called when the lobby is about to be removed
   */
  public removing(): void {
    for (const player of Object.values(this.players)) {
      player.removing();
    }
  }

  // Event methods

  public broadcast(event: string, content: unknown) {
    for (const player of Object.values(this.players)) {
      player.emit(event, content);
    }
  }

  // Player control methods

  public getCode(): string {
    return this.code;
  }

  public getPlayer(id: string): Player | undefined {
    return this.players[id];
  }

  public createPlayer(): Player {
    const id = this.playerIdCounter++;
    const player = new Player(id.toString(), this);
    this.players[player.getId()] = player;
    return player;
  }

  public removePlayer(id: string) {
    const player = this.players[id];
    if (!player) return;

    player.removing();
    delete this.players[id];

    if (Object.keys(this.players).length === 0) {
      this.manager.deleteLobby(this.getCode());
    }
  }
}

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

  public deleteLobby(code: string): void {
    const lobby = this.lobbies[code];
    if (!lobby) return;

    lobby.removing();
    delete this.lobbies[code];
  }

  public getPlayer(token: PlayerToken): Player | undefined {
    const lobby = this.getLobby(token.getLobbyCode());
    if (!lobby) return;

    return lobby.getPlayer(token.getPlayerId());
  }
}
