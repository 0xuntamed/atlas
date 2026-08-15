import { prisma } from "../../db/prisma";

interface EnsureUserInput {
  clerkId: string;
  email?: string;
  name?: string;
}

/**
 * Upsert the local mirror of a Clerk user. Called on every authenticated
 * request; cheap and idempotent. Clerk remains the identity source of truth,
 * while this row anchors all user-owned domain data by a stable local id.
 */
export async function ensureUser({ clerkId, email, name }: EnsureUserInput) {
  return prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, email, name },
    // Keep email/name fresh if the token carries them, but never null them out.
    update: {
      ...(email !== undefined ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
    },
  });
}
