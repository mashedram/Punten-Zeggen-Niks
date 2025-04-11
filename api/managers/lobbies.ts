import { EventEmitter, on } from "ws";

function generateRandomCode(length: number): string {
    let value = "";

    for (let i = 0; i < length; i++) {
        value += Math.floor(Math.random() * 9)
    }

    return value
}

const LOBBY_CODE_LENGTH = 6

export class PlayerEvent<T> {
    private id: number;
    private type: string;
    private data: T;

    constructor(id: number, type: string, data: T) {
        this.id = id
        this.type = type
        this.data = data
    }

    public getId(): number {
        return this.id
    }

    public getType(): string {
        return this.type
    }

    public getData(): T {
        return this.data
    }
}

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
    private id: string;
    private lobby: Lobby;
    /// The last timestamp on which an action was done
    private lastAction: Date;
    private emitter: EventEmitter;
    private lastEventId: number;

    constructor(lobby: Lobby) {
        this.id = crypto.randomUUID()
        this.lobby = lobby
        this.lastAction = new Date()
        this.emitter = new EventEmitter()
        this.lastEventId = 0
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

    public on(): NodeJS.AsyncIterator<PlayerEvent<unknown>[]> {
        return on(this.emitter, "event")
    }

    public emit<T>(type: string, content: T) {
        const event = new PlayerEvent(++this.lastEventId, type, content)
        this.emitter.emit("event", event)
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