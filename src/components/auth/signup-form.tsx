"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "better-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import GithubLogo from "@/assets/logos/github-logo.svg";
import GoogleLogo from "@/assets/logos/google-logo.svg";
import { AlertError } from "@/components/ui/alert-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { authClient, signInWithProvider } from "@/lib/auth-client";
import { APP_NAME, APP_ROUTES } from "@/lib/contants";
import { nanoid } from "@/lib/nanoid";
import { cn } from "@/lib/utils";
import { useUserUpdateMutation } from "@/queries/user.queries";
import { SignupSchema } from "@/schemas/auth.schemas";
import { type SignupFormData } from "@/types/auth.types";

/**
 * Asynchronously generates an avatar image for a user by sending a POST request to the avatar API.
 *
 * @param seed - A string used to seed the avatar generation process.
 * @param uniqueIdentifier - The unique identifier of the user for whom the avatar is being generated.
 * @returns A promise that resolves to the URL of the generated avatar image.
 * @throws Will throw an error if the upload fails or the response is not OK.
 */
export const createAvatarImage = async (
  seed: string,
  uniqueIdentifier: string,
) => {
  const res = await fetch(`${env.NEXT_PUBLIC_APP_BASE_URL}/api/avatar`, {
    method: "POST",
    body: JSON.stringify({
      seed,
      key: `users/${uniqueIdentifier}/${nanoid(10)}.svg`,
    }),
  });
  // Check if the upload was successful
  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
  }
  // // Get the image URL from the response
  const response = await res.json();
  // Return the image URL
  return response.url as string;
};

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const updateUserMutation = useUserUpdateMutation();

  async function onSubmit(data: SignupFormData) {
    setErrorMessage("");
    await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: APP_ROUTES.DASHBOARD,
      fetchOptions: {
        onSuccess: async (ctx) => {
          const user = ctx.data.user as User;
          // Generate the user image
          const userImage = await createAvatarImage(data.name, user.id);
          // Update the user image in the database
          await updateUserMutation.mutateAsync({
            image: userImage,
          });
          router.push(APP_ROUTES.DASHBOARD);
        },
        onError: (ctx) => {
          setErrorMessage(ctx.error.message);
        },
      },
    });
  }

  async function handleGoogleLogin() {
    await signInWithProvider("google");
  }

  async function handleGithubLogin() {
    await signInWithProvider("github");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign up for {APP_NAME}</CardTitle>
          <CardDescription>
            Get started with your free account today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertError message={errorMessage} className="mb-6" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid">
                  <Input
                    id="name"
                    type="text"
                    label="Full name"
                    {...register("name")}
                    error={errors.name !== undefined}
                    errorMessage={errors?.name?.message}
                  />
                </div>
                <div className="grid">
                  <Input
                    id="email"
                    type="email"
                    label="Email"
                    {...register("email")}
                    error={errors.email !== undefined}
                    errorMessage={errors?.email?.message}
                  />
                </div>
                <div className="grid">
                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    {...register("password")}
                    error={errors.password !== undefined}
                    errorMessage={errors?.password?.message}
                  />
                </div>
                <Button type="submit" className="w-full" loading={isSubmitting}>
                  Sign up
                </Button>
              </div>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={handleGithubLogin}
                  leftIcon={
                    <Image
                      alt="Sign in with Github"
                      src={GithubLogo}
                      className="size-4"
                    />
                  }
                >
                  Sign up with GitHub
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={handleGoogleLogin}
                  leftIcon={
                    <Image
                      alt="Sign in with Google"
                      src={GoogleLogo}
                      className="size-4"
                    />
                  }
                >
                  Sign up with Google
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-balance text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
