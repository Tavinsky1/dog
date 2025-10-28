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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          const user = await (prisma as any).user.findUnique({
            where: { email: credentials.email }
          });

          if (!user || !user.passwordHash) {
            console.error("User not found or no password hash");
            return null;
          }

          const isPasswordValid = await compare(credentials.password, user.passwordHash);

          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  session: { 
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
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
    async session({ session, user }) {
      // attach user ID and role to session (database strategy)
      if (session.user && user) {
        (session.user as any).id = user.id;
        (session.user as any).role = (user as any).role;
      }
      return session;
    }
  }
};
