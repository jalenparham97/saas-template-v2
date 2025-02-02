import { z } from "@/lib/zod";

export const UserUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .optional()
    .nullable()
    .describe("The name of the user."),
  image: z
    .string()
    .url()
    .optional()
    .nullable()
    .describe("The image of the user."),
});
