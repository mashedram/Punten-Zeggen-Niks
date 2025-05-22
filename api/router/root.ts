import { router } from '@/api/server';
import { lobbyRouter } from '@/api/router/manager/lobby';
import { strategoRouter } from './manager/stratego';

export const appRouter = router({
  lobby: lobbyRouter,
  stratego: strategoRouter,
});

export type AppRouter = typeof appRouter;
