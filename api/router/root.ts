import { router } from '@/api/server';
import { lobbyRouter } from '@/api/router/manager/lobby';
import { strategoRouter } from './manager/stratego';
import { syncRouter } from './manager/sync';

export const appRouter = router({
  lobby: lobbyRouter,
  stratego: strategoRouter,
  sync: syncRouter,
});

export type AppRouter = typeof appRouter;
