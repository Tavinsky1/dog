import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[Auth] Missing credentials");
          return null;
        }

        try {
          // Normalize input (lowercase and trim)
          const identifier = credentials.email.toLowerCase().trim();
          
          console.log("[Auth] Attempting login for:", identifier);
          
          // Try to find user by email OR name (username)
          const user = await (prisma as any).user.findFirst({
            where: {
              OR: [
                { email: identifier },
                { name: identifier }
              ]
            }
          });

          if (!user) {
            console.error("[Auth] User not found:", identifier);
            return null;
          }

          if (!user.passwordHash) {
            console.error("[Auth] User has no password hash (likely Google OAuth user):", identifier);
            return null;
          }

          const isPasswordValid = await compare(credentials.password, user.passwordHash);

          if (!isPasswordValid) {
            console.error("[Auth] Invalid password for user:", identifier);
            return null;
          }

          console.log("[Auth] Login successful for user:", user.email);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("[Auth] Authorization error:", error);
          return null;
        }
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signOut({ token }) {
      console.log("[Auth] User signed out:", token?.email);
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Auto-create user in database on Google sign-in
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await (prisma as any).user.findUnique({
            where: { email: user.email }
          });

          if (!existingUser) {
            // Create new user
            await (prisma as any).user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split('@')[0],
                role: "USER",
                emailVerified: new Date(), // Google emails are pre-verified
              }
            });
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      // attach user ID and role to session from JWT token
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in - user object is available
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      // On update trigger, refresh user data from DB
      else if (trigger === "update" && token.email) {
        const dbUser = await (prisma as any).user.findUnique({
          where: { email: token.email },
          select: { role: true, id: true }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.sub = dbUser.id;
        }
      }
      // For subsequent requests, token already has role - no DB query needed
      return token;
    }
  }
};
