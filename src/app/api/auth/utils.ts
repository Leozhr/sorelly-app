import { db } from "@/db";
import { sessionsTable, usersTable, verificationTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type UserRecord = typeof usersTable.$inferSelect;
export type VerificationRecord = typeof verificationTable.$inferSelect;
export type SessionRecord = typeof sessionsTable.$inferSelect;
export type EnsureUserProfile = {
  id: number;
  name?: string | null;
};

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  return user as UserRecord | undefined;
}

export async function ensureUser(email: string, profile?: EnsureUserProfile) {
  const existing = await getUserByEmail(email);

  if (existing) {
    if (profile && profile.id !== existing.id) {
      throw new Error("ID do usuário divergente para o email informado.");
    }

    if (profile?.name && profile.name !== existing.name) {
      const [updated] = await db
        .update(usersTable)
        .set({ name: profile.name })
        .where(eq(usersTable.id, existing.id))
        .returning();

      return (
        (updated as UserRecord | undefined) ?? { ...existing, name: profile.name }
      );
    }

    return existing;
  }

  if (!profile) {
    throw new Error(
      "Perfil do usuário obrigatório para cadastrar um novo usuário.",
    );
  }

  const [user] = await db
    .insert(usersTable)
    .values({
      id: profile.id,
      email,
      name: profile.name ?? email.split("@")[0] ?? email,
    })
    .returning();

  return user as UserRecord;
}

export async function upsertVerification(userId: number, token: string) {
  await db.delete(verificationTable).where(eq(verificationTable.userId, userId));

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const [verification] = await db
    .insert(verificationTable)
    .values({ userId, token, expiresAt })
    .returning();

  return verification as VerificationRecord;
}

export async function findVerification(userId: number, token: string) {
  const [verification] = await db
    .select()
    .from(verificationTable)
    .where(
      and(eq(verificationTable.userId, userId), eq(verificationTable.token, token)),
    )
    .limit(1);

  return verification as VerificationRecord | undefined;
}

export async function removeVerification(id: number) {
  await db.delete(verificationTable).where(eq(verificationTable.id, id));
}

export async function markUserAsVerified(userId: number) {
  const [user] = await db
    .update(usersTable)
    .set({ isVerified: true })
    .where(eq(usersTable.id, userId))
    .returning();

  return user as UserRecord | undefined;
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createSession(userId: number, sessionToken: string) {
  const [session] = await db
    .insert(sessionsTable)
    .values({ userId, sessionToken, expiresAt: null })
    .returning();

  return session as SessionRecord;
}

export async function removeSessionsByUser(userId: number) {
  await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
}
