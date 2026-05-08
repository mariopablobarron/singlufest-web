import { z } from "zod";

export const giveawayEntrySchema = z.object({
  email: z.string().email("Email no válido"),
  name: z.string().min(2).max(80).optional().or(z.literal("")),
  igHandle: z
    .string()
    .min(2, "Tu @handle de Instagram")
    .max(40)
    .regex(/^@?[a-zA-Z0-9._]+$/, "Solo letras, números, puntos y guion bajo"),
  sharedPostUrl: z
    .string()
    .url("URL no válida")
    .regex(/instagram\.com/i, "Tiene que ser una URL de Instagram (post, reel o story)")
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Necesitamos tu consentimiento" }) }),
  // honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export type GiveawayEntryInput = z.infer<typeof giveawayEntrySchema>;

export const giveawayAdminSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, "solo minúsculas, números y guiones"),
  title: z.string().min(2).max(120),
  shortPitch: z.string().min(2).max(280),
  description: z.string().min(10),
  prize: z.string().min(2),
  imageUrl: z.string().url().optional().or(z.literal("")),
  hashtag: z.string().max(40).optional().or(z.literal("")),
  mentionTarget: z.string().max(40).default("singlufest"),
  rules: z.array(z.string()).default([]),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED", "DRAWN"]).default("DRAFT"),
  isPublished: z.coerce.boolean().default(false),
  maxEntries: z.coerce.number().int().positive().optional().nullable(),
});
