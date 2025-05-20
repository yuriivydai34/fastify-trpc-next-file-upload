import { z } from "zod";
import { router, publicProcedure } from "./trpc";
import { testSchema } from "schema";

export const exampleRouter = router({
  example: publicProcedure.input(testSchema).query(({ ctx, input }) => {
    ctx.req.log.info(input, "example");
    return input;
  }),
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query((opts) => {
      const { input } = opts;
      return `Hello ${input.name}` as const;
    }),
});
