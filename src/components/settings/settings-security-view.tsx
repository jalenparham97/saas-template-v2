"use client";

import GithubLogo from "@/assets/logos/github-logo.svg";
import GoogleLogo from "@/assets/logos/google-logo.svg";
import { SettingsSection } from "@/components/settings/settings-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import {
  authClient,
  type AuthProvider,
  linkSocialProvider,
} from "@/lib/auth-client";
import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";
import { APP_NAME, APP_ROUTES } from "@/lib/contants";
import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type UserSession } from "@/types/auth.types";
import { parseUserAgent } from "@/utils/parse-user-agent";
import { IconCircleCheck, IconServer } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isEmpty } from "radash";

export function SettingsSecurityView() {
  const user = api.user.getUser.useQuery();
  const currentSession = api.user.getActiveSession.useQuery();
  const apiUtils = api.useUtils();

  const githubAccount = user.data?.accounts.find(
    (account) => account.providerId === "github",
  );

  const googleAccount = user.data?.accounts.find(
    (account) => account.providerId === "google",
  );

  const otherSessions = user?.data?.sessions.filter(
    (session) => session.id !== currentSession?.data?.session?.id,
  );

  const currentUserSession = user?.data?.sessions.find(
    (session) => session.id === currentSession?.data?.session?.id,
  );

  const revokeOtherSessionsMutation = api.user.revokeOtherSessions.useMutation({
    onSuccess: async () => {
      await apiUtils.user.getUser.invalidate();
    },
  });

  async function handleRevokeOtherSessions() {
    await revokeOtherSessionsMutation.mutateAsync();
  }

  async function handleLinkSocialProvider(provider: AuthProvider) {
    await linkSocialProvider(provider, `${APP_ROUTES.SETTINGS}/security`);
  }

  const hasOtherSessions = !isEmpty(otherSessions);

  return (
    <div>
      {user.isLoading && (
        <div className="flex items-center justify-center py-[300px] sm:py-[400px]">
          <Loader />
        </div>
      )}

      {!user.isLoading && (
        <div>
          <SettingsSection>
            <div>
              <h2 className="text-base font-semibold leading-7">
                Connected Accounts
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Link your account to your third-party accounts to sign in faster
                and more securely.
              </p>
            </div>

            <Card className="divide-y divide-gray-200 md:col-span-2">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Image src={GithubLogo} alt="alt" className="size-7" />
                  <p className="font-medium">Github</p>
                </div>

                <div>
                  {githubAccount ? (
                    <IconCircleCheck className="size-7 text-green-600" />
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleLinkSocialProvider("github")}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Image src={GoogleLogo} alt="alt" className="size-7" />
                  <p className="font-medium">Google</p>
                </div>

                <div>
                  {googleAccount ? (
                    <IconCircleCheck className="size-7 text-green-600" />
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleLinkSocialProvider("google")}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </SettingsSection>

          <Separator className="my-6" />

          <SettingsSection>
            <div>
              <h2 className="text-base font-semibold leading-7">Sessions</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Manage your active sessions where your logged into {APP_NAME}.{" "}
                Click the sign out button to end a specifc session.
              </p>
            </div>

            <div className="md:col-span-2">
              {currentUserSession && (
                <>
                  <div className="space-y-4">
                    {currentUserSession && (
                      <Session session={currentUserSession} isCurrentSession />
                    )}
                  </div>

                  {!isEmpty(otherSessions) && <Separator className="my-6" />}

                  <div className="space-y-4">
                    {otherSessions?.map((session) => (
                      <Session key={session.id} session={session} />
                    ))}

                    {!isEmpty}
                  </div>
                </>
              )}

              {hasOtherSessions && (
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={handleRevokeOtherSessions}
                  loading={revokeOtherSessionsMutation.isPending}
                >
                  Sign out all other sessions
                </Button>
              )}
            </div>
          </SettingsSection>
        </div>
      )}
    </div>
  );
}

function Session({
  session,
  isCurrentSession = false,
}: {
  session: UserSession;
  isCurrentSession?: boolean;
}) {
  const router = useRouter();
  const apiUtils = api.useUtils();
  const parsedAgent = parseUserAgent(session?.userAgent ?? "");

  const browserName = parsedAgent.browser.name;
  const osName = parsedAgent.os.name ?? "";

  const revokeSessionMutation = api.user.revokeSession.useMutation({
    onSuccess: async () => {
      await apiUtils.user.getUser.invalidate();
    },
  });

  async function handleRevokeSession() {
    if (isCurrentSession) {
      return await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(APP_ROUTES.LOGIN);
          },
        },
      });
    }
    await revokeSessionMutation.mutateAsync({ token: session.token });
  }

  return (
    <Card key={session.id} className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-100 p-3">
            <IconServer />
          </div>
          <div>
            <p className="text-sm font-medium leading-6">
              {browserName} on {capitalizeFirstLetter(osName)}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-sm leading-6 text-gray-500">
                {session.ipAddress} -{" "}
                <span
                  className={cn({
                    "font-medium text-green-600": isCurrentSession,
                  })}
                >
                  {isCurrentSession
                    ? "Current session"
                    : `Last active ${dayjs(session.updatedAt).fromNow()}`}
                </span>
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRevokeSession}
          loading={revokeSessionMutation.isPending}
        >
          Sign out
        </Button>
      </div>
    </Card>
  );
}
