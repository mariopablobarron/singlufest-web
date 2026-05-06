import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateLong(date: Date, locale = "es-ES") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateRange(start: Date, end?: Date | null, locale = "es-ES") {
  const sameDay = end && start.toDateString() === end.toDateString();
  if (!end || sameDay) return formatDateLong(start, locale);
  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" });
  return `${fmt.format(start)} – ${formatDateLong(end, locale)}`;
}

export function eur(cents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function absoluteUrl(path = "") {
  const base = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}
