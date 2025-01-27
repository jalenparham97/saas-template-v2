import { type z } from "@/lib/zod";
import { type LoginSchema, type SignupSchema } from "@/schemas/auth.schemas";
import { type Session } from "@prisma/client";

export type LoginFormData = z.infer<typeof LoginSchema>;

export type SignupFormData = z.infer<typeof SignupSchema>;

export type UserSession = Session;
