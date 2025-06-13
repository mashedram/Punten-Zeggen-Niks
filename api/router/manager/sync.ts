import { CLIENT_MANAGER } from '@/common/networking/client/ClientManager';
import { SERVER_DATA_STORE } from '@/common/networking/Globals';
import { getDataInstanceDescriptor } from '@/common/networking/tracking/descriptors/DataInstanceDescriptor';
import { publicProcedure, router } from '@/api/server';
import { z } from 'zod';

export const syncRouter = router({
  refetch: publicProcedure
    .input(
      z.object({
        instanceId: z.number(),
        descriptorId: z.number(),
        step: z.number().default(0),
        reinstantiate: z.boolean().default(false),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log(`Refetch for ${input.instanceId} requested`);
      const client = ctx.client;
      if (!client) {
        throw new Error('Client not found');
      }
      const descriptor = getDataInstanceDescriptor(input.descriptorId);
      if (!descriptor) {
        throw new Error('Descriptor not found');
      }
      const instance = SERVER_DATA_STORE.getInstance(
        input.instanceId,
        descriptor,
      );
      if (!instance) {
        throw new Error('Instance not found');
      }
      instance.resend(client, input.step, input.reinstantiate);
    }),
  listen: publicProcedure
    .input(z.string().optional())
    .subscription(async function* ({ ctx, input, signal }) {
      return yield* CLIENT_MANAGER.listen(ctx, input, signal);
    }),
});
