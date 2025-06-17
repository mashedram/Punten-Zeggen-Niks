import { publicProcedure, router } from '@/api/server';
import { z } from 'zod';
import fs from 'fs';

export const feeddbackRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        about: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      fs.mkdirSync(`./feedback/`);
      const data = {
        name: input.name,
        type: input.type,
        about: input.about,
        message: input.message,
        date: new Date().toISOString(),
      };

      fs.writeFileSync(
        `./feedback/${data.name}-${Date.now()}.json`,
        JSON.stringify(data, null, 2),
        'utf-8',
      );
    }),
});
