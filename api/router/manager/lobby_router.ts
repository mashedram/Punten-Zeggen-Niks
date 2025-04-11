import { LobbyManager, PlayerToken } from "@/api/managers/lobbies";
import { publicProcedure, router } from "@/api/server";
import z from "zod"

const manager = new LobbyManager()

export const lobbyRouter = router({
    getPlayer: publicProcedure.input(z.object({ token: z.string() })).query(({ input }) => {
        const player = manager.getPlayer(PlayerToken.fromString(input.token));

        if (!player)
            return

        return {
            id: player.getId()
        }
    }),
    joinLobby: publicProcedure.input(z.object({ code: z.string() })).mutation(({ input }) => {
        const lobby = manager.getLobby(input.code)
        if (!lobby)
            return

        return PlayerToken.fromPlayer(lobby.createPlayer()).toString()
    }),
    createLobby: publicProcedure.query(() => {
        return manager.createLobby()
    }),
    listen: publicProcedure.input(z.object({ token: z.string() })).subscription(async function* ({ input }) {
        const player = manager.getPlayer(PlayerToken.fromString(input.token))
        if (!player)
            return

        for await (const [event] of player.on()) {
            yield event;
        }
    })
})