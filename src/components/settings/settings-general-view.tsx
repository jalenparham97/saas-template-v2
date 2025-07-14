"use client";

import { AccountDeleteDialog } from "@/components/settings/account-delete-dialog";
import { ChangeEmailDialog } from "@/components/settings/change-email-dialog";
import { SettingsSection } from "@/components/settings/settings-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { UploadButton } from "@/components/ui/upload-button";
import { env } from "@/env";
import { useDialog } from "@/hooks/use-dialog";
import { useFileDeleteMutation } from "@/queries/storage.queries";
import {
  useChangeEmailMutation,
  useUser,
  useUserUpdateMutation,
} from "@/queries/user.queries";
import { UserUpdateSchema } from "@/schemas/user.schemas";
import { type UserUpdateInput } from "@/types/user.types";
import { IMAGE_MIME_TYPE } from "@/types/utility.types";
import { createImageUploadUrl } from "@/utils/create-image-upload-url";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconExclamationCircle, IconTrash, IconX } from "@tabler/icons-react";
import { useUploadFile } from "better-upload/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

const isDefaultImage = (image: string | null | undefined) =>
  image?.startsWith("https://ui-avatars.com");

export function AccountGeneralView({ searchParams }: Props) {
  const [deleteAccountModal, deleteAccountModalHandler] = useDialog();
  const [changeEmailModal, changeEmailModalHandler] = useDialog();
  const [uploadError, setUploadError] = useState("");
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState(
    (searchParams?.error as string) || "",
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserUpdateSchema),
  });

  const user = useUser();

  const { control } = useUploadFile({
    route: "accountLogoUpload",
  });
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

    if (!userImage.startsWith(env.NEXT_PUBLIC_S3_PUBLIC_BUCKET_URL)) return;

    const fileKey = `users/${user?.data?.id}/${userImage.split("/").pop()!}`;

    try {
      return await deleteFileMutation.mutateAsync({ fileKey });
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserImage = async (fileKey: string) => {
    return await userUpdateMutation.mutateAsync({
      image: createImageUploadUrl(fileKey),
    });
  };

  const removeUserImage = async () => {
    await deleteCurrentUserImage(user.data?.image);
    await userUpdateMutation.mutateAsync({
      image: "",
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
              <h2 className="text-base leading-7 font-semibold">Profile</h2>
              <p className="mt-1 text-[15px] leading-6 text-gray-500">
                Set your name and contact information, the email address entered
                here is used for your login access.
              </p>
            </div>

            <Card className="md:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-200 bg-sidebar px-6 py-4">
                <p className="text-base leading-6 font-medium">Your profile</p>
              </div>

              {uploadError && (
                // TODO: make this a component
                <div className="relative mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <div className="shrink-0">
                        <IconExclamationCircle
                          className="h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{uploadError}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1 right-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:bg-red-100 hover:text-red-500"
                      onClick={() => setUploadError("")}
                    >
                      <IconX size={16} />
                    </Button>
                  </div>
                </div>
              )}

              <form className="p-6">
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full flex items-center gap-x-8">
                    <Avatar className="h-24 w-24 flex-none rounded-lg object-cover">
                      <AvatarImage src={user?.data?.image ?? ""} />
                      <AvatarFallback className="text-2xl">
                        {user?.data?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <UploadButton
                          control={control}
                          accept={IMAGE_MIME_TYPE.join(",")}
                          variant="outline"
                          text="Change image"
                          uploadOverride={async (file, metadata) => {
                            console.log("Metadata: ", metadata);
                            // delete the old user image
                            await deleteCurrentUserImage(user?.data?.image);

                            // rename the file
                            const renamedFile = new File(
                              [file],
                              `${user?.data?.id}-${file.name}`,
                              {
                                type: file.type,
                              },
                            );

                            // upload the new file
                            const result = await control.upload(
                              renamedFile,
                              metadata,
                            );

                            // update the user image
                            await updateUserImage(result.file.objectKey);
                          }}

                          // onBeforeUpload={async ({ file }) => {
                          //   // delete the old user image
                          //   await deleteCurrentUserImage(user?.data?.image);

                          //   // rename the file
                          //   return new File(
                          //     [file],
                          //     `${user?.data?.id}-${file.name}`,
                          //     {
                          //       type: file.type,
                          //     },
                          //   );
                          // }}
                          // onUploadComplete={async ({ file }) => {
                          //   await updateUserImage(file.objectKey);
                          // }}
                          // onUploadError={(error) => {
                          //   if (error.message) {
                          //     setUploadError(error.message);
                          //   }
                          // }}
                        />
                        {user?.data?.image &&
                          !isDefaultImage(user?.data?.image) && (
                            <Button
                              variant="outline"
                              type="button"
                              leftIcon={
                                <IconTrash size={16} className="text-red-500" />
                              }
                              onClick={removeUserImage}
                              loading={
                                deleteFileMutation.isPending ||
                                userUpdateMutation.isPending
                              }
                            >
                              Remove
                            </Button>
                          )}
                      </div>
                      <p className="mt-2 text-xs leading-5 text-gray-400">
                        JPG, PNG or WEBP. 1MB max.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-full">
                    <Input
                      label="Name"
                      autoComplete="name"
                      type="text"
                      {...register("name")}
                      error={errors.name !== undefined}
                      errorMessage={errors?.name?.message}
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
                          className="absolute top-1 right-1 h-8 w-8"
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
              <h2 className="text-base leading-7 font-semibold text-red-600">
                Danger Zone
              </h2>
              <p className="mt-1 text-[15px] leading-6 text-gray-500">
                Be careful, some of these actions are not reversible.
              </p>
            </div>

            <Card className="divide-y divide-gray-200 md:col-span-2">
              <div className="flex items-center justify-between bg-sidebar px-6 py-4">
                <p className="text-base leading-6 font-medium">
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
