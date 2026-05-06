import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Tu nombre, por favor").max(80),
  email: z.string().email("Email no válido"),
  phone: z
    .string()
    .trim()
    .min(6, "Teléfono demasiado corto")
    .max(30)
    .optional()
    .or(z.literal("")),
  partySize: z
    .coerce.number()
    .int()
    .min(1, "Mínimo 1 persona")
    .max(12, "Para grupos mayores escríbenos por email"),
  eventId: z.string().cuid().optional().or(z.literal("")),
  dietary: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Necesitamos tu consentimiento" }),
  }),
  hcaptchaToken: z.string().optional(),
  // honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().max(40).optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const postSchema = z.object({
  title: z.string().min(3).max(140),
  slug: z.string().min(3).max(140),
  excerpt: z.string().max(280).optional(),
  contentMdx: z.string().min(20),
  coverUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  scheduledAt: z.coerce.date().optional().nullable(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(180).optional(),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
});

export const sponsorSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(80),
  logoUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(500).optional(),
  tier: z.enum(["DIAMOND", "GOLD", "SILVER", "BRONZE", "COLLAB"]).default("BRONZE"),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const eventSchema = z.object({
  editionId: z.string().cuid(),
  title: z.string().min(2).max(140),
  slug: z.string().min(2).max(140),
  kind: z.enum(["SHOWCOOKING", "CHARLA", "CATA", "TALLER", "CONCIERTO", "MERCADO", "OTRO"]).default("OTRO"),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional().nullable(),
  venue: z.string().max(140).optional(),
  capacity: z.coerce.number().int().positive().optional().nullable(),
  priceCents: z.coerce.number().int().min(0).default(0),
  description: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  speaker: z.string().max(140).optional(),
  isPublished: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export const settingsSchema = z.object({
  festivalName: z.string().min(2).max(80),
  tagline: z.string().min(2).max(180),
  contactEmail: z.string().email(),
  instagramUrl: z.string().url(),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  tiktokUrl: z.string().url().optional().or(z.literal("")),
  newsletterUrl: z.string().url().optional().or(z.literal("")),
  heroVideoUrl: z.string().url().optional().or(z.literal("")),
  heroPosterUrl: z.string().url().optional().or(z.literal("")),
  bookingsOpen: z.boolean().default(false),
  metaTitle: z.string().min(10).max(70),
  metaDescription: z.string().min(20).max(180),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
});
