import { betterFetch } from "@better-fetch/fetch";
import { betterAuth } from "better-auth";
import { type NextRequest } from "next/server";

import { authConfig } from "@/server/auth/config";

export const auth = betterAuth(authConfig);

type Session = typeof auth.$Infer.Session;

export async function getBetterAuthSession(request: NextRequest) {
  return await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      // get the cookie from the request
      cookie: request.headers.get("cookie") ?? "",
    },
  });
}

// import NextAuth from "next-auth";
// import { cache } from "react";

// import { authConfig } from "./config";

// const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

// const auth = cache(uncachedAuth);

// export { auth, handlers, signIn, signOut };
