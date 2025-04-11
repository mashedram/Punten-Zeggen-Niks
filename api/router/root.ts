import { publicProcedure, router } from "@/api/server";
import { z } from 'zod'
import { lobbyRouter } from "./manager/lobby_router";

export const appRouter = router({
    lobby: lobbyRouter,
})

export type AppRouter = typeof appRouter