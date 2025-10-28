import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
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
          console.log("[Auth] Missing credentials");
          return null;
        }

        const emailOrUsername = credentials.email.toLowerCase().trim();
        console.log("[Auth] Login attempt for:", emailOrUsername);

        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: emailOrUsername },
                { name: emailOrUsername }
              ]
            }
          });

          if (!user) {
            console.log("[Auth] User not found:", emailOrUsername);
            return null;
          }

          if (!user.passwordHash) {
            console.log("[Auth] User has no password (OAuth only):", user.email);
            return null;
          }

          const isValid = await compare(credentials.password, user.passwordHash);
          
          if (!isValid) {
            console.log("[Auth] Invalid password for:", user.email);
            return null;
          }

          console.log("[Auth] Login successful for:", user.email);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error("[Auth] Login error:", error);
          return null;
        }
      }
    })
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role || "USER";
      }
      
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true }
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await prisma.user.upsert({
            where: { email: user.email! },
            update: { 
              name: user.name,
              image: user.image,
              emailVerified: new Date()
            },
            create: {
              email: user.email!,
              name: user.name,
              image: user.image,
              role: "USER",
              emailVerified: new Date()
            }
          });
        } catch (error) {
          console.error("[Auth] Error saving OAuth user:", error);
          return false;
        }
      }
      return true;
    }
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};
