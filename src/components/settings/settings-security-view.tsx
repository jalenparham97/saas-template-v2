"use client";

import GithubLogo from "@/assets/logos/github-logo.svg";
import GoogleLogo from "@/assets/logos/google-logo.svg";
import { PasskeyCreateDialog } from "@/components/settings/passkey-create-dialog";
import { PasskeyDeleteDialog } from "@/components/settings/passkey-delete-dialog";
import { PasskeyUpdateDialog } from "@/components/settings/passkey-update-dialog";
import { SettingsSection } from "@/components/settings/settings-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { useDialog } from "@/hooks/use-dialog";
import {
  authClient,
  type AuthProvider,
  linkSocialProvider,
} from "@/lib/auth-client";
import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";
import { APP_NAME, APP_ROUTES } from "@/lib/contants";
import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import {
  useDeleteUserPasskeyMutation,
  useRevokeAllUserSessionsMutation,
  useRevokeUserSessionMutation,
  useUser,
  useUserCurrentSession,
} from "@/queries/user.queries";
import { type Passkey, type Session } from "@/types/auth.types";
import { formatDate } from "@/utils/format-date";
import { parseUserAgent } from "@/utils/parse-user-agent";
import {
  IconCircleCheck,
  IconKey,
  IconPencil,
  IconPlus,
  IconServer,
  IconTrash,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function SettingsSecurityView() {
  const [openPasskeyDialog, openPasskeyDialogHandlers] = useDialog();
  const user = useUser();
  const currentSession = useUserCurrentSession();

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

  const revokeAllSessionsMutaion = useRevokeAllUserSessionsMutation();

  async function revokeAllSessions() {
    await revokeAllSessionsMutaion.mutateAsync();
  }

  async function connectSocialProvider(provider: AuthProvider) {
    await linkSocialProvider(provider, `${APP_ROUTES.SETTINGS}/security`);
  }

  return (
    <div>
      {user.isLoading && (
        <div className="flex items-center justify-center py-[300px]">
          <Loader />
        </div>
      )}

      {!user.isLoading && (
        <div>
          <SettingsSection>
            <div>
              <h2 className="text-base font-semibold leading-7">Password</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Manage settings for your account passwords.
              </p>
            </div>

            <Card className="divide-y divide-gray-200 md:col-span-2">
              <div className="flex items-center justify-between bg-sidebar px-6 py-4">
                <p className="text-base font-medium leading-6">
                  Your account password
                </p>
              </div>
              <div className="p-6">
                <p className="leading-6 text-gray-500">
                  You can change or reset your password here. If you don&apos;t
                  have a password, you can create one here.
                </p>
              </div>
              <div className="border-t border-gray-200 p-6">
                <Button>Change password</Button>
              </div>
            </Card>
          </SettingsSection>

          <Separator className="my-8" />

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
              <div className="flex items-center justify-between bg-sidebar px-6 py-4">
                <p className="text-base font-medium leading-6">
                  Your connected accounts
                </p>
              </div>

              <div className="flex items-center justify-between px-6 py-4">
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
                      onClick={() => connectSocialProvider("github")}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
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
                      onClick={() => connectSocialProvider("google")}
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
              <h2 className="text-base font-semibold leading-7">Passkeys</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Use passkeys as an easier and more secure alternative to
                passwords.
              </p>
            </div>

            <div className="md:col-span-2">
              <Card>
                <div className="flex items-center justify-between border-b border-gray-200 bg-sidebar px-6 py-4">
                  <p className="text-base font-medium leading-6">
                    Your passkeys
                  </p>
                  <Button
                    variant="outline"
                    leftIcon={<IconPlus size={16} />}
                    onClick={openPasskeyDialogHandlers.open}
                  >
                    Add a passkey
                  </Button>
                </div>
                <div>
                  {user.data?.passkeys && user.data?.passkeys.length > 0 && (
                    <div className="divide-y divide-gray-200">
                      {user.data?.passkeys.map((passkey) => (
                        <Passkey key={passkey.id} passkey={passkey} />
                      ))}
                    </div>
                  )}
                  {user.data?.passkeys?.length === 0 && (
                    <div className="py-12">
                      <EmptyState
                        icon={<IconKey className="size-8" />}
                        title="No Passkeys"
                        subtitle="Add a passkey to login more securely"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>
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
              <Card>
                <div className="flex items-center justify-between border-b border-gray-200 bg-sidebar px-6 py-4">
                  <p className="text-base font-medium leading-6">
                    Your sessions
                  </p>
                  <Button
                    variant="outline"
                    onClick={revokeAllSessions}
                    loading={revokeAllSessionsMutaion.isPending}
                  >
                    Sign out all sessions
                  </Button>
                </div>

                {currentUserSession && (
                  <div className="divide-y divide-gray-200">
                    {currentUserSession && (
                      <Session session={currentUserSession} isCurrentSession />
                    )}
                    {otherSessions?.map((session) => (
                      <Session key={session.id} session={session} />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </SettingsSection>
        </div>
      )}

      <PasskeyCreateDialog
        open={openPasskeyDialog}
        onClose={openPasskeyDialogHandlers.close}
      />
    </div>
  );
}

function Session({
  session,
  isCurrentSession = false,
}: {
  session: Session;
  isCurrentSession?: boolean;
}) {
  const router = useRouter();
  const parsedAgent = parseUserAgent(session?.userAgent ?? "");

  const browserName = parsedAgent.browser.name;
  const osName = parsedAgent.os.name ?? "";

  const revokeSessionMutation = useRevokeUserSessionMutation();

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
    <div key={session.id} className="px-6 py-4">
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
    </div>
  );
}

function Passkey({ passkey }: { passkey: Passkey }) {
  const [openPasskeyDialog, openPasskeyDialogHandlers] = useDialog();
  const [openDeletePasskeyDialog, openDeletePasskeyDialogHandlers] =
    useDialog();

  const deletePasskeyMutation = useDeleteUserPasskeyMutation();

  async function deletePasskey() {
    await deletePasskeyMutation.mutateAsync(passkey.id);
  }

  return (
    <div key={passkey.id} className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-100 p-3">
            <IconKey />
          </div>
          <div>
            <p className="font-medium leading-6">{passkey.name}</p>
            <div className="flex items-center gap-4">
              <p className="text-sm leading-6 text-gray-500">
                Added on {formatDate(passkey.createdAt as Date)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={openPasskeyDialogHandlers.open}
          >
            <IconPencil className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={openDeletePasskeyDialogHandlers.open}
          >
            <IconTrash className="size-5 text-red-500" />
          </Button>
        </div>
      </div>

      <PasskeyUpdateDialog
        open={openPasskeyDialog}
        onClose={openPasskeyDialogHandlers.close}
        passkey={passkey}
      />

      <PasskeyDeleteDialog
        passkeyName={passkey.name ?? ""}
        open={openDeletePasskeyDialog}
        onClose={openDeletePasskeyDialogHandlers.close}
        onDelete={deletePasskey}
        loading={deletePasskeyMutation.isPending}
      />
    </div>
  );
}
