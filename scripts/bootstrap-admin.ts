export const MIN_ADMIN_PASSWORD_LENGTH = 20;

type BootstrapEnv = Readonly<Record<string, string | undefined>>;

export type BootstrapAdmin = {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  passwordHash: string;
};

export type BootstrapAdminCreate = {
  email: string;
  name: string;
  passwordHash: string;
  role: "ADMIN";
  isActive: true;
};

type EnsureBootstrapAdminOptions<T extends BootstrapAdmin> = {
  env: BootstrapEnv;
  findByEmail: (email: string) => Promise<T | null>;
  createAdmin: (data: BootstrapAdminCreate) => Promise<T>;
  hashPassword: (password: string) => Promise<string>;
};

function requireAdminEmail(value: string | undefined): string {
  const email = value?.trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_EMAIL_REQUIRED");
  }
  return email;
}

function requireStrongAdminPassword(value: string | undefined): string {
  if (!value) throw new Error("ADMIN_PASSWORD_REQUIRED_FOR_BOOTSTRAP");
  if (value.length < MIN_ADMIN_PASSWORD_LENGTH) {
    throw new Error("ADMIN_PASSWORD_TOO_SHORT");
  }
  if (value.trim() !== value) {
    throw new Error("ADMIN_PASSWORD_SURROUNDING_WHITESPACE");
  }

  const characterClasses = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/]
    .filter((pattern) => pattern.test(value)).length;
  if (characterClasses < 3) throw new Error("ADMIN_PASSWORD_TOO_WEAK");
  return value;
}

/**
 * Crea el admin solo durante el bootstrap inicial.
 *
 * Un reseed nunca actualiza passwordHash, role ni isActive. Si el email ya
 * pertenece a otro rol, falla para que una operación administrativa explícita
 * resuelva el conflicto.
 */
export async function ensureBootstrapAdmin<T extends BootstrapAdmin>(
  options: EnsureBootstrapAdminOptions<T>,
): Promise<{ admin: T; created: boolean }> {
  const email = requireAdminEmail(options.env.ADMIN_EMAIL);
  const existing = await options.findByEmail(email);

  if (existing) {
    if (existing.role !== "ADMIN") throw new Error("ADMIN_EMAIL_ROLE_CONFLICT");
    return { admin: existing, created: false };
  }

  const password = requireStrongAdminPassword(options.env.ADMIN_PASSWORD);
  const passwordHash = await options.hashPassword(password);
  const admin = await options.createAdmin({
    email,
    name: "Admin Singlufest",
    passwordHash,
    role: "ADMIN",
    isActive: true,
  });
  return { admin, created: true };
}
