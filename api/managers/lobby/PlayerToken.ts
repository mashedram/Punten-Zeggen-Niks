import { Player } from "./Player";

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
