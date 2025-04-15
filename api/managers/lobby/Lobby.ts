import { z } from 'zod';
import { LOBBY_CONSTANTS, LobbyManager } from './LobbyManager';
import {
  ConnectionState,
  Player,
  playerDataSchema,
  priviligedPlayerDataSchema,
} from './Player';
import { PlayerToken } from './PlayerToken';

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
  self: priviligedPlayerDataSchema,
  players: z.array(playerDataSchema),
});

// Create an extendable type of the schema to enforce it upon a class or somewhere else within TypeScript
export type LobbyData = z.infer<typeof lobbyDataSchema>;

export class Lobby {
  // Keep a reference to the manager that created this lobby instance
  private manager: LobbyManager;

  code: string;
  private players: { [id: string]: Player } = {};
  private playerIdCounter = 0;

  constructor(manager: LobbyManager) {
    this.manager = manager;
    this.code = generateRandomCode(LOBBY_CONSTANTS.LOBBY_CODE_LENGTH);
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

  public getDataForPlayer(player: Player): LobbyData {
    return {
      code: this.code,
      self: player.getPrivilegedData(),
      players: this.getActivePlayers()
        .filter(p => p !== player)
        .map(p => p.getPublicData()),
    };
  }

  public syncWith(player: Player) {
    const data = this.getDataForPlayer(player);
    player.emit(LOBBY_CONSTANTS.LOBBY_STATE_EVENT, data);
  }

  public syncOthers(player: Player) {
    for (const other of this.getActivePlayers()) {
      if (other === player) continue;
      other.emit(
        LOBBY_CONSTANTS.LOBBY_STATE_EVENT,
        this.getDataForPlayer(other),
      );
    }
  }

  public getPlayer(id: string): Player | undefined {
    return this.players[id];
  }

  /**
   * Get all players that are currently in the lobby and are active (connected, not inactive, etc.)
   */
  public getActivePlayers(): Player[] {
    return Object.values(this.players).filter(
      p => p.getConnectionState() === ConnectionState.Connected,
    );
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
