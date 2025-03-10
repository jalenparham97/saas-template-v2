"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Label } from "@/components/ui/label";
import { authClient, signInWithProvider } from "@/lib/auth-client";
import { APP_ROUTES } from "@/lib/contants";
import { cn } from "@/lib/utils";
import { SignupSchema } from "@/schemas/auth.schemas";
import { type SignupFormData } from "@/types/auth.types";

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
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignupFormData) {
    setErrorMessage("");
    await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: APP_ROUTES.DASHBOARD,
      fetchOptions: {
        onSuccess: (ctx) => {
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
          <CardTitle className="text-xl">Sign up for Acme Inc.</CardTitle>
          <CardDescription>
            Get started with your free account and unlimited snippets.
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
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
