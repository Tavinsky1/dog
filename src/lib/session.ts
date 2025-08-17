import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Get the logged-in user (or null) with role + id attached. */
export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, name: true, role: true, points: true },
  });
  return user ?? null;
}

/** Ensure the current user has one of the roles, else throw 403. */
export async function requireRole(roles: Array<"ADMIN" | "MOD">) {
  const u = await getSessionUser();
  if (!u || !roles.includes(u.role as any)) {
    const err = new Error("forbidden");
    (err as any).statusCode = 403;
    throw err;
  }
  return u;
}
