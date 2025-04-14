import { LobbyManager } from "@/api/managers/lobbies"

describe("LobbyManager", () => {
    test("Create and destroy a lobby", () => {
        const lobbyManager = new LobbyManager()
        
        const lobby = lobbyManager.createLobby()
        const lobbyCode = lobby.getCode()

        expect(lobbyManager.getLobby(lobbyCode)).toBeDefined()
        lobbyManager.deleteLobby(lobbyCode)
        expect(lobbyManager.getLobby(lobbyCode)).toBeUndefined()
    })
})