import { NextResponse, type NextRequest } from "next/server";

import {
  apiAuthPrefix,
  APP_ROUTES,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/lib/contants";
import { getBetterAuthSession } from "@/server/auth";

export default async function authMiddleware(request: NextRequest) {
  const nextUrl = request.nextUrl;
  const { data: session } = await getBetterAuthSession(request);

  const isLoggedIn = !!session;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, nextUrl));
  }

  return;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
