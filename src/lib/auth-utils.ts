import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as { id: string; name?: string | null; email?: string | null; image?: string | null; role: "USER" | "EDITOR" | "ADMIN" } | undefined;
}

/**
 * Require authentication - redirect to sign in if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/api/auth/signin");
  }
  return user;
}

/**
 * Require admin role - redirect to home if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    redirect("/");
  }
  return user;
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}
