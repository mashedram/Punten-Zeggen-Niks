import { publicProcedure, router } from "@/api/server";
import { z } from 'zod'

export const appRouter = router({
    users: publicProcedure.input(z.object({ name: z.string().optional() })).query(({ ctx, input }) => {
        const users = [
            {
                name: "Jan"
            },
            {
                name: "Willem"
            }
        ]

        return input.name ? users.filter(v => v.name == input.name) : users
    })
})

export type AppRouter = typeof appRouter