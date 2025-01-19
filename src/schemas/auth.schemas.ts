import { z } from "@/lib/zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email is required.",
    })
    .trim(),
  password: z.string().min(1, { message: "Password is required." }).trim(),
});

export const SignupSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }).trim(),
  email: z
    .string()
    .email({
      message: "Email is required.",
    })
    .trim(),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .max(24, { message: "Password must be between 1 and 24 characters." })
    .trim(),
});
