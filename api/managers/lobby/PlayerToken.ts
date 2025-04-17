export class PlayerToken {
  private lobbyCode: string;
  private playerAuthToken: string;

  constructor(lobbyCode: string, playerAuthToken: string) {
    this.lobbyCode = lobbyCode;
    this.playerAuthToken = playerAuthToken;
  }

  public static fromString(token: string) {
    const [lobbyCode, playerAuthToken] = token.split('|');
    return new PlayerToken(lobbyCode, playerAuthToken);
  }

  public toString(): string {
    return `${this.lobbyCode}|${this.playerAuthToken}`;
  }

  public getLobbyCode(): string {
    return this.lobbyCode;
  }

  public getPlayerAuthToken(): string {
    return this.playerAuthToken;
  }
}
