import * as z from "zod";

export const socialSchema = z.object({
  twitter: z.string(),
});

export const formSchema = z.object({
  someprop: z.string().min(2).max(50),
  social: socialSchema,
});

export type ProfileFormValues = z.infer<typeof formSchema>;
