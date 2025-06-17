import { router } from '@/api/server';
import { lobbyRouter } from '@/api/router/manager/lobby';
import { strategoRouter } from './manager/stratego';
import { syncRouter } from './manager/sync';
import { feeddbackRouter } from './manager/feedback';

export const appRouter = router({
  lobby: lobbyRouter,
  stratego: strategoRouter,
  sync: syncRouter,
  feedback: feeddbackRouter,
});

export type AppRouter = typeof appRouter;
