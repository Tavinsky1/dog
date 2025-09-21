import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Get the logged-in user (or null) with role + id attached. */
export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, name: true, role: true },
  });
  return user ?? null;
}

/** Ensure the current user has one of the roles, else throw 403. */
export async function requireRole(roles: Array<"ADMIN" | "EDITOR">) {
  const u = await getSessionUser();
  if (!u || !roles.includes(u.role as "ADMIN" | "EDITOR")) {
    const err = new Error("forbidden");
    (err as any).statusCode = 403;
    throw err;
  }
  return u;
}
