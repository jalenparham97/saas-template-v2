"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AlertError } from "@/components/ui/alert-error";
import { AlertSuccess } from "@/components/ui/alert-success";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { z } from "@/lib/zod";
import { IconArrowLeft } from "@tabler/icons-react";

const schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[!@#$%^&*()_\-+=[\]{};:,.<>?/~|]/,
      "Password must contain at least one special character",
    ),
});

type FormData = z.infer<typeof schema>;

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
} & React.ComponentPropsWithoutRef<"div">;

export function ResetPasswordForm({
  className,
  searchParams,
  ...props
}: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  const token = (searchParams?.token as string) ?? "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    setErrorMessage("");
    await authClient.resetPassword({
      newPassword: data.password,
      token,
      fetchOptions: {
        onSuccess: (ctx) => {
          reset({ password: "" });
          setShowSuccessMessage(
            "Password reset successfully. You may now login or close this tab.",
          );
        },
        onError: (ctx) => {
          setErrorMessage(ctx.error.message ?? "Something went wrong");
        },
      },
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your new password below to complete the reset process. Ensure
            its strong and secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertError message={errorMessage} className="mb-6" />
          <AlertSuccess message={showSuccessMessage} />

          {!showSuccessMessage && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <Input
                      id="password"
                      type="password"
                      label="New password"
                      {...register("password")}
                      error={errors.password !== undefined}
                      errorMessage={errors?.password?.message}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    loading={isSubmitting}
                  >
                    Reset password
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      <div className="mx-auto mt-2 max-w-sm">
        <Button
          href="/auth/login"
          variant="outline"
          leftIcon={<IconArrowLeft size={16} />}
        >
          Back to login page
        </Button>
      </div>
    </div>
  );
}
