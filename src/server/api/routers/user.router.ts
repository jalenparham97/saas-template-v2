import { z } from "@/lib/zod";
import { auth } from "@/server/auth";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        accounts: {
          select: {
            id: true,
            accountId: true,
            providerId: true,
          },
        },
        sessions: true,
      },
    });

    return user;
  }),
  revokeSession: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await auth.api.revokeSession({
        headers: ctx.headers,
        body: { token: input.token },
      });
    }),
  revokeOtherSessions: protectedProcedure.mutation(async ({ ctx }) => {
    return await auth.api.revokeOtherSessions({
      headers: ctx.headers,
    });
  }),
  getActiveSession: protectedProcedure.query(async ({ ctx }) => {
    return await auth.api.getSession({ headers: ctx.headers });
  }),
  getAccounts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        accounts: {
          select: {
            id: true,
            accountId: true,
            providerId: true,
          },
        },
      },
    });
  }),
});
