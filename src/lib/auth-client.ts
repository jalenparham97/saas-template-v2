import { env } from "@/env";
import { APP_ROUTES } from "@/lib/contants";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_BASE_URL, // the base url of your auth server
});

export type AuthProvider = "google" | "github";

export async function signInWithProvider(provider: AuthProvider) {
  return await authClient.signIn.social({
    provider,
    callbackURL: `${env.NEXT_PUBLIC_APP_BASE_URL}${APP_ROUTES.DASHBOARD}`,
  });
}

export async function linkSocialProvider(
  provider: AuthProvider,
  callbackURL: string,
) {
  await authClient.linkSocial({
    provider, // Provider to link
    callbackURL, // Callback URL after linking completes
  });
}
