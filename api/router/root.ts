import { publicProcedure, router } from '@/api/server';

let teller = 0;

export const appRouter = router({
  teller: publicProcedure.query(() => {
    return teller;
  }),
  add: publicProcedure.mutation(() => {
    teller += 1;
    return teller;
  }),
});

export type AppRouter = typeof appRouter;
