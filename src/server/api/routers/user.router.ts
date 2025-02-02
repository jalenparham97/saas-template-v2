import { APP_ROUTES } from "@/lib/contants";
import { z } from "@/lib/zod";
import { UserUpdateSchema } from "@/schemas/user.schemas";
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
        passkeys: true,
        sessions: true,
      },
    });

    return user;
  }),
  updateUser: protectedProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name ?? ctx.session.user.name, image: input.image },
        include: {
          accounts: {
            select: {
              id: true,
              accountId: true,
              providerId: true,
            },
          },
          passkeys: true,
          sessions: true,
        },
      });
    }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await auth.api.deleteUser({
      headers: ctx.headers,
      body: { callbackURL: `/${APP_ROUTES.LOGIN}` },
    });
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
  revokeAllSessions: protectedProcedure.mutation(async ({ ctx }) => {
    return await auth.api.revokeSessions({
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
  updatePasskeyName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const passkey = await ctx.db.passkey.update({
        where: { id: input.id },
        data: { name: input.name },
      });

      return passkey;
    }),
});
