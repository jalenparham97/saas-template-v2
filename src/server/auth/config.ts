import { type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, organization } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

import { env } from "@/env";
import { APP_NAME } from "@/lib/contants";
import { db } from "@/server/db";

export const authConfig: BetterAuthOptions = {
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  plugins: [
    openAPI(),
    passkey({
      rpName: APP_NAME,
      rpID: "localhost",
      origin: "http://localhost:3000",
    }),
    organization(),
  ],
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 5 * 60, // Cache duration in seconds
  //   },
  // },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
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
    },
  },
};
