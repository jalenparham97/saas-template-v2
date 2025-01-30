import { env } from "@/env";
import { APP_ROUTES } from "@/lib/contants";
import { passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_BASE_URL, // the base url of your auth server
  plugins: [passkeyClient()],
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
    provider,
    callbackURL,
  });
}

export async function getUserPasskeys() {
  const passkeys = await authClient.passkey.listUserPasskeys();
  return { passkeys: passkeys.data, error: passkeys.error };
}

export async function generatePasskey(name: string) {
  return await authClient.passkey.addPasskey({ name });
}

export async function removePasskey(id: string) {
  return await authClient.passkey.deletePasskey({ id });
}
