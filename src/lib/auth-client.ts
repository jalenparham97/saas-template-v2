import { env } from "@/env";
import { APP_ROUTES } from "@/lib/contants";
import { stripeClient } from "@better-auth/stripe/client";
import { adminClient, passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_BASE_URL, // the base url of your auth server
  plugins: [
    adminClient(),
    passkeyClient(),
    stripeClient({ subscription: true }),
  ],
});

/**
 * Supported authentication providers
 */
export type AuthProvider = "google" | "github";

/**
 * Initiates a social sign-in flow with the specified provider
 * @param provider - The authentication provider to use (google or github)
 * @returns A promise that resolves when the sign-in flow is initiated
 */
export async function signInWithProvider(provider: AuthProvider) {
  return await authClient.signIn.social({
    provider,
    callbackURL: `${env.NEXT_PUBLIC_APP_BASE_URL}${APP_ROUTES.DASHBOARD}`,
  });
}

/**
 * Links a social provider to an existing account
 * @param provider - The authentication provider to link
 * @param callbackURL - The URL to redirect to after linking
 */
export async function linkSocialProvider(
  provider: AuthProvider,
  callbackURL: string,
) {
  await authClient.linkSocial({
    provider,
    callbackURL,
  });
}

/**
 * Retrieves the list of passkeys registered for the current user
 * @returns An object containing the passkeys data and any potential error
 */
export async function getUserPasskeys() {
  const passkeys = await authClient.passkey.listUserPasskeys();
  return { passkeys: passkeys.data, error: passkeys.error };
}

/**
 * Generates a new passkey for the current user
 * @param name - A friendly name for the passkey
 * @returns A promise that resolves with the newly created passkey
 */
export async function generatePasskey(name: string) {
  return await authClient.passkey.addPasskey({ name });
}

/**
 * Removes a passkey by its ID
 * @param id - The unique identifier of the passkey to remove
 * @returns A promise that resolves when the passkey is deleted
 */
export async function removePasskey(id: string) {
  return await authClient.passkey.deletePasskey({ id });
}

/**
 * Sends a password reset email to the specified email address.
 * @param email - The email address of the user requesting password reset
 * @returns A promise that resolves when the password reset email has been sent
 * @throws Will throw an error if the email sending fails
 */
export async function sendPasswordResetEmail(email: string) {
  return await authClient.forgetPassword({
    email,
    redirectTo: APP_ROUTES.RESET_PASSWORD,
  });
}

/**
 * Sends a verification email to change the user's email address.
 * @param newEmail - The new email address to change to
 * @returns A promise that resolves when the verification email has been sent
 * @throws Will throw an error if the email verification request fails
 */
export async function sendChangeEmailVerificationEmail(newEmail: string) {
  return await authClient.changeEmail({
    newEmail,
    callbackURL: APP_ROUTES.SETTINGS,
  });
}

/**
 * Sends an email verification email to the specified email address.
 * @param email - The email address to send the verification email to.
 * @returns A promise that resolves when the email is sent.
 */
export async function sendEmailVerificationEmail(email: string) {
  return await authClient.sendVerificationEmail({
    email,
    callbackURL: APP_ROUTES.DASHBOARD,
  });
}
