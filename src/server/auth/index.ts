import { betterFetch } from "@better-fetch/fetch";
import { betterAuth } from "better-auth";
import { type NextRequest } from "next/server";

import { authConfig } from "@/server/auth/config";

export const auth = betterAuth(authConfig);

type Session = typeof auth.$Infer.Session;

/**
 * Retrieves an authenticated session using the provided NextRequest object.
 * Makes a fetch request to '/api/auth/get-session' endpoint with the request's cookie.
 *
 * @param request - The Next.js request object containing headers and URL information
 * @returns Promise<Session> A promise that resolves to the session data
 * @throws Will throw an error if the fetch request fails
 */
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
