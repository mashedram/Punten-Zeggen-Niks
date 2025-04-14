import { LOBBY_CONSTANTS, LobbyManager } from "./LobbyManager";
import { Player } from "./Player";

function generateRandomCode(length: number): string {
    let value = "";
  
    for (let i = 0; i < length; i++) {
      value += Math.floor(Math.random() * 9);
    }
  
    return value;
  }

export class Lobby {
    // Keep a reference to the manager that created this lobby instance
    private manager: LobbyManager;
  
    private code: string;
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
  
  