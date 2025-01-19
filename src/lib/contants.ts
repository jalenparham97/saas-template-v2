export const DEFAULT_LOGIN_REDIRECT = "/";

export const APP_NAME = "Acme Inc.";

export const APP_ROUTES = {
  LOGIN: "/auth/login",
  SIGN_UP: "/auth/signup",
  DASHBOARD: "/dashboard",
} as const;

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const publicRoutes = ["/api/webhooks/stripe"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 */
export const authRoutes = ["/auth/login", "/auth/signup"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The prefix for TRPC routes
 * Routes that start with this prefix are used for TRPC purposes
 */
export const trpcPrefix = "/api/trpc";
