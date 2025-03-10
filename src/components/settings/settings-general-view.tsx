"use client";

import { AccountDeleteDialog } from "@/components/settings/account-delete-dialog";
import { ChangeEmailDialog } from "@/components/settings/change-email-dialog";
import { SettingsSection } from "@/components/settings/settings-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env";
import { useDialog } from "@/hooks/use-dialog";
import { nanoid } from "@/lib/nanoid";
import {
  useFileDeleteMutation,
  useFileUploadUrlMutation,
} from "@/queries/storage.queries";
import {
  useChangeEmailMutation,
  useUser,
  useUserUpdateMutation,
} from "@/queries/user.queries";
import { UserUpdateSchema } from "@/schemas/user.schemas";
import { type UserUpdateInput } from "@/types/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPhoto, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export function SettingsGeneralView({ searchParams }: Props) {
  const [logoUploaderOpen, logoUploaderHandler] = useDialog();
  const [deleteAccountModal, deleteAccountModalHandler] = useDialog();
  const [changeEmailModal, changeEmailModalHandler] = useDialog();
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState(
    (searchParams?.error as string) || "",
  );
  const { register, handleSubmit } = useForm<UserUpdateInput>({
    resolver: zodResolver(UserUpdateSchema),
  });

  const user = useUser();

  const uploadUrlMutation = useFileUploadUrlMutation();
  const deleteFileMutation = useFileDeleteMutation();
  const userUpdateMutation = useUserUpdateMutation({ showToast: true });
  const changeEmailMutation = useChangeEmailMutation({
    onSuccess: () => {
      setShowEmailSent(true);
    },
  });

  const onSubmit = async (data: UserUpdateInput) => {
    await userUpdateMutation.mutateAsync({
      name: data.name ?? user?.data?.name,
    });
  };

  const deleteCurrentUserImage = async (
    userImage: string | null | undefined,
  ) => {
    if (!userImage) return;

    if (!userImage.startsWith(env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL)) return;

    const fileKey = userImage.split("/").pop()!;

    try {
      return await deleteFileMutation.mutateAsync({ fileKey });
    } catch (error) {
      console.log(error);
    }
  };

  const onFileUpload = async (file: File) => {
    await deleteCurrentUserImage(user?.data?.image);

    const fileKey = `${user?.data?.id}-${nanoid()}-${file.name}`;
    const { uploadUrl } = await uploadUrlMutation.mutateAsync({
      fileKey,
    });
    if (uploadUrl) {
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "multiport/formdata" },
        body: file,
      });
      await userUpdateMutation.mutateAsync({
        image: `${env.NEXT_PUBLIC_R2_PUBLIC_BUCKET_URL}/${fileKey}`,
      });
    }
  };

  const onUrlUpload = async (url: string) => {
    await deleteCurrentUserImage(user?.data?.image);

    await userUpdateMutation.mutateAsync({
      image: url,
    });
  };

  const handleUpdateEmail = async (email: string) => {
    setNewEmail(email);
    await changeEmailMutation.mutateAsync({ newEmail: email });
  };

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
              <h2 className="text-base font-semibold leading-7">Profile</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Set your name and contact information, the email address entered
                here is used for your login access.
              </p>
            </div>

            <Card className="md:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-200 bg-sidebar px-6 py-4">
                <p className="text-base font-medium leading-6">Your profile</p>
              </div>

              <form className="p-6">
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full flex items-center gap-x-8">
                    <Avatar className="h-24 w-24 flex-none rounded-lg object-cover">
                      <AvatarImage src={user?.data?.image ?? ""} />
                      <AvatarFallback className="rounded-none bg-gray-200 uppercase">
                        <IconPhoto size={40} />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={logoUploaderHandler.open}
                      >
                        Change image
                      </Button>
                      <p className="mt-2 text-xs leading-5 text-gray-400">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-full">
                    <Input
                      label="Full name"
                      autoComplete="given-name"
                      {...register("name")}
                      defaultValue={user?.data?.name ?? ""}
                    />
                  </div>

                  <div className="sm:col-span-full">
                    <Input
                      label="Email address"
                      autoComplete="email"
                      type="email"
                      value={user?.data?.email ?? ""}
                      disabled
                      className=""
                    />
                    <div className="mt-2 flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={changeEmailModalHandler.open}
                      >
                        Change email
                      </Button>
                    </div>

                    {showEmailSent && (
                      <Alert className="relative mt-6">
                        <AlertTitle>Check your email</AlertTitle>
                        <AlertDescription>
                          <p className="text-gray-900">
                            We&apos;ve sent an email to your inbox to change you
                            email to{" "}
                            <span className="font-semibold">{newEmail}</span>.
                            To verify this change, click the link in the email.
                          </p>
                        </AlertDescription>
                        <Button
                          size="icon"
                          type="button"
                          className="absolute right-1 top-1 h-8 w-8"
                          variant="ghost"
                          onClick={() => setShowEmailSent(false)}
                        >
                          <IconX className="h-4 w-4" />
                        </Button>
                      </Alert>
                    )}
                  </div>
                </div>
              </form>
              <div className="border-t border-gray-200 p-6">
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  loading={userUpdateMutation.isPending}
                >
                  Save changes
                </Button>
              </div>
            </Card>
          </SettingsSection>

          <Separator className="my-8" />

          <SettingsSection>
            <div>
              <h2 className="text-base font-semibold leading-7 text-red-600">
                Danger Zone
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Be careful, some of these actions are not reversible.
              </p>
            </div>

            <Card className="divide-y divide-gray-200 md:col-span-2">
              <div className="flex items-center justify-between bg-sidebar px-6 py-4">
                <p className="text-base font-medium leading-6">
                  Delete your account
                </p>
              </div>
              <div>
                <div className="p-6">
                  <p className="leading-6 text-gray-500">
                    Permanently delete your account, and all associated data
                    with it. We will also cancel any associated subscriptions.
                    This action cannot be undone - please proceed with caution.
                  </p>
                </div>
                <div className="border-t border-gray-200 p-6">
                  <Button
                    variant="destructive"
                    leftIcon={<IconTrash size={16} />}
                    onClick={deleteAccountModalHandler.open}
                  >
                    Delete my account
                  </Button>
                </div>
              </div>
            </Card>
          </SettingsSection>
        </div>
      )}

      <ImageUploader
        open={logoUploaderOpen}
        onClose={logoUploaderHandler.close}
        submit={onUrlUpload}
        onUpload={onFileUpload}
        showUnsplash={false}
        maxFileSize={1000000}
      />

      <AccountDeleteDialog
        open={deleteAccountModal}
        onClose={deleteAccountModalHandler.close}
      />

      <ChangeEmailDialog
        open={changeEmailModal}
        onClose={changeEmailModalHandler.close}
        submit={handleUpdateEmail}
      />
    </div>
  );
}
