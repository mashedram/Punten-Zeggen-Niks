import { router } from '@/api/server';
import { lobbyRouter } from '@/api/router/manager/lobby';

export const appRouter = router({
  lobby: lobbyRouter,
});

export type AppRouter = typeof appRouter;
