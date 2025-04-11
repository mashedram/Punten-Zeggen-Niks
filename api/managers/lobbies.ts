function generateRandomCode(length: number): string {
    let value = "";

    for (let i = 0; i < length; i++) {
        value += Math.floor(Math.random() * 9)
    }

    return value
}

const LOBBY_CODE_LENGTH = 6

export class PlayerToken {
    private lobbyCode: string
    private playerId: string

    constructor(lobbyCode: string, playerId: string) {
        this.lobbyCode = lobbyCode
        this.playerId = playerId
    }

    public static fromPlayer(player: Player) {
        return new PlayerToken(player.getLobby().getCode(), player.getId())
    }

    public static fromString(token: string) {
        const [lobbyCode, playerId] = token.split('|')
        return new PlayerToken(lobbyCode, playerId)
    }

    public toString(): string {
        return `${this.lobbyCode}|${this.playerId}`
    }

    public getLobbyCode(): string {
        return this.lobbyCode
    }

    public getPlayerId(): string {
        return this.playerId
    }
}

export class Player {
    private id: string
    private lobby: Lobby
    /// The last timestamp on which an action was done
    private lastAction: Date

    constructor(lobby: Lobby) {
        this.id = crypto.randomUUID()
        this.lobby = lobby
        this.lastAction = new Date()
    }

    public getId(): string {
        return this.id
    }

    public getLobby(): Lobby {
        return this.lobby
    }

    public refresh() {
        this.lastAction = new Date()
    }
}

class Lobby {
    private code: string
    private players: {[id: string]: Player} = {}

    constructor() {
        this.code = generateRandomCode(LOBBY_CODE_LENGTH)
    }

    public getCode(): string {
        return this.code
    }

    public getPlayer(id: string): Player | undefined {
        return this.players[id]
    }

    public createPlayer(): Player {
        const player = new Player(this)
        this.players[player.getId()] = player
        return player
    }
}

export class LobbyManager {
    private lobbies: {[key: string]: Lobby} = {}

    public createLobby(): Lobby {
        const lobby = new Lobby()
        this.lobbies[lobby.getCode()] = lobby

        return lobby
    }

    public getLobby(code: string): Lobby | undefined {
        return this.lobbies[code]
    }

    public deleteLobby(code: string): void {
        delete this.lobbies[code]
    }

    public getPlayer(token: PlayerToken): Player | undefined {
        const lobby = this.getLobby(token.getLobbyCode())
        if (!lobby)
            return

        return lobby.getPlayer(token.getPlayerId())
    }
}