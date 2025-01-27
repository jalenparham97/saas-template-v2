"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { LoginSchema } from "@/schemas/auth.schemas";
import { type LoginFormData } from "@/types/auth.types";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setErrorMessage("");
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: APP_ROUTES.DASHBOARD,
      fetchOptions: {
        onSuccess: () => {
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
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AlertError message={errorMessage} className="mb-6" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Input
                    id="email"
                    type="email"
                    label="Email"
                    {...register("email")}
                    error={errors.email !== undefined}
                    errorMessage={errors?.email?.message}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    error={errors.password !== undefined}
                    errorMessage={errors?.password?.message}
                  />
                </div>
                <Button type="submit" className="w-full" loading={isSubmitting}>
                  Login
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
                  Login with GitHub
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
                  Login with Google
                </Button>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="underline underline-offset-4"
                >
                  Sign up
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
