import { type z } from "@/lib/zod";
import { type LoginSchema, type SignupSchema } from "@/schemas/auth.schemas";

export type LoginFormData = z.infer<typeof LoginSchema>;

export type SignupFormData = z.infer<typeof SignupSchema>;
