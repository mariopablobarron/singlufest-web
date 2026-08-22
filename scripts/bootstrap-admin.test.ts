import assert from "node:assert/strict";
import test from "node:test";
import {
  ensureBootstrapAdmin,
  type BootstrapAdmin,
  type BootstrapAdminCreate,
} from "./bootstrap-admin";

const strongPassword = "V3ry-Long-Random-Passphrase!";

function makeAdmin(overrides: Partial<BootstrapAdmin> = {}): BootstrapAdmin {
  return {
    id: "admin-1",
    email: "admin@example.com",
    role: "ADMIN",
    isActive: true,
    passwordHash: "existing-hash",
    ...overrides,
  };
}

test("un bootstrap nuevo falla sin ADMIN_PASSWORD", async () => {
  await assert.rejects(
    ensureBootstrapAdmin({
      env: { ADMIN_EMAIL: "admin@example.com" },
      findByEmail: async () => null,
      createAdmin: async () => makeAdmin(),
      hashPassword: async () => "hash",
    }),
    /ADMIN_PASSWORD_REQUIRED_FOR_BOOTSTRAP/,
  );
});

test("un bootstrap nuevo rechaza una contraseña corta", async () => {
  await assert.rejects(
    ensureBootstrapAdmin({
      env: { ADMIN_EMAIL: "admin@example.com", ADMIN_PASSWORD: "Short123!" },
      findByEmail: async () => null,
      createAdmin: async () => makeAdmin(),
      hashPassword: async () => "hash",
    }),
    /ADMIN_PASSWORD_TOO_SHORT/,
  );
});

test("un bootstrap válido crea un ADMIN activo con hash", async () => {
  let createdWith: BootstrapAdminCreate | null = null;
  const result = await ensureBootstrapAdmin({
    env: { ADMIN_EMAIL: "ADMIN@EXAMPLE.COM", ADMIN_PASSWORD: strongPassword },
    findByEmail: async () => null,
    hashPassword: async (password) => `hash:${password.length}`,
    createAdmin: async (data) => {
      createdWith = data;
      return makeAdmin({ email: data.email, passwordHash: data.passwordHash });
    },
  });

  assert.equal(result.created, true);
  assert.deepEqual(createdWith, {
    email: "admin@example.com",
    name: "Admin Singlufest",
    passwordHash: `hash:${strongPassword.length}`,
    role: "ADMIN",
    isActive: true,
  });
});

test("un reseed preserva hash, rol y estado del admin existente", async () => {
  const existing = Object.freeze(makeAdmin({ isActive: false }));
  let createCalls = 0;
  let hashCalls = 0;

  const result = await ensureBootstrapAdmin({
    env: { ADMIN_EMAIL: existing.email },
    findByEmail: async () => existing,
    createAdmin: async () => {
      createCalls++;
      return existing;
    },
    hashPassword: async () => {
      hashCalls++;
      return "unexpected";
    },
  });

  assert.equal(result.created, false);
  assert.equal(result.admin, existing);
  assert.equal(result.admin.passwordHash, "existing-hash");
  assert.equal(result.admin.role, "ADMIN");
  assert.equal(result.admin.isActive, false);
  assert.equal(createCalls, 0);
  assert.equal(hashCalls, 0);
});

test("un reseed no promociona otra cuenta a ADMIN", async () => {
  await assert.rejects(
    ensureBootstrapAdmin({
      env: { ADMIN_EMAIL: "editor@example.com", ADMIN_PASSWORD: strongPassword },
      findByEmail: async () => makeAdmin({ email: "editor@example.com", role: "EDITOR" }),
      createAdmin: async () => makeAdmin(),
      hashPassword: async () => "hash",
    }),
    /ADMIN_EMAIL_ROLE_CONFLICT/,
  );
});
