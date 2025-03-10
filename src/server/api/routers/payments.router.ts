import { stripeApiClient } from "@/lib/stripe";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paymentsRouter = createTRPCRouter({
  getBillingPortalSession: protectedProcedure
    .input(
      z.object({
        stripeCustomerId: z.string(),
        returnUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log("Headers: ", ctx.headers);
      return await stripeApiClient.billingPortal.sessions.create({
        customer: input.stripeCustomerId,
        return_url: `${input.returnUrl}`,
      });
    }),
});
