import { type z } from "@/lib/zod";
import { type LoginSchema, type SignupSchema } from "@/schemas/auth.schemas";
import { type RouterOutputs } from "@/trpc/react";

export type LoginFormData = z.infer<typeof LoginSchema>;

export type SignupFormData = z.infer<typeof SignupSchema>;

export type Session = NonNullable<
  RouterOutputs["user"]["getUser"]
>["sessions"][0];

export type Passkey = NonNullable<
  RouterOutputs["user"]["getUser"]
>["passkeys"][0];
