import { createHash, randomBytes } from "node:crypto";

/** Construye un voterToken estable a partir de IP+cookie sin guardar PII. */
export function buildVoterToken({
  ip,
  cookieToken,
}: {
  ip: string;
  cookieToken: string;
}) {
  const secret = process.env.AUTH_SECRET ?? "fallback-secret";
  return createHash("sha256")
    .update(`${ip}::${cookieToken}::${secret}`)
    .digest("hex");
}

/** Genera un cookie token aleatorio si el visitante no tiene uno todavía. */
export function newCookieToken() {
  return randomBytes(32).toString("hex");
}

export const VOTE_COOKIE_NAME = "sf_voter";

/** Devuelve la lista de slugs por los que ese voterToken ya votó (para enriquecer UI). */
export const MAX_VOTES_PER_VISITOR = 12; // se admite votar a varios candidatos
