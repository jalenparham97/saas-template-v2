import { stripe } from "@better-auth/stripe";
import { betterAuth, type AuthContext } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, openAPI } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { headers } from "next/headers";

import { env } from "@/env";
import { APP_NAME } from "@/lib/contants";
import {
  sendEmailChangeEmail,
  sendPasswordResetEmail,
  sendVerifyEmail,
} from "@/lib/mail";
import { stripeApiClient } from "@/lib/stripe";
import { db } from "@/server/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  plugins: [
    admin({
      adminRoles: ["admin", "superadmin"],
    }),
    openAPI(),
    passkey({
      rpName: APP_NAME,
      rpID: "localhost",
      origin: "http://localhost:3000",
    }),
    stripe({
      stripeClient: stripeApiClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "pro",
            priceId: "price_1Pvzd24MSHP8haifCe9PFN73",
            annualDiscountPriceId: "price_1R0o164MSHP8haifVv1mksa4",
            freeTrial: {
              days: 14,
            },
          },
        ],
      },
    }),
  ],
  advanced: {
    database: {
      generateId: false,
    },
  },
  onAPIError: {
    onError: async (error: unknown, ctx: AuthContext) => {
      const errorContext = {
        error,
        baseURL: ctx.baseURL,
        session: ctx.session,
        trustedOrigins: ctx.trustedOrigins,
        request: {
          url: ctx.options.baseURL,
          method: ctx.options.basePath,
        },
      };
      console.info("Auth API error", errorContext);
    },
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url);
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await sendEmailChangeEmail(user.email, newEmail, url);
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerifyEmail(user.email, url);
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "email-password", "microsoft"],
    },
  },
});

export const getAuthSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return { session: session?.session, user: session?.user };
};
