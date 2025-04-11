import { router } from "@/api/server";
import { lobbyRouter } from "./manager/lobby_router";

export const appRouter = router({
    lobby: lobbyRouter,
})

export type AppRouter = typeof appRouter