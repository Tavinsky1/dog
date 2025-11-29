import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const identifier = credentials.email.toLowerCase().trim();
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier },
                { name: identifier }
              ]
            }
          });

          if (!user?.passwordHash) {
            return null;
          }

          const isValid = await compare(credentials.password, user.passwordHash);
          if (!isValid) {
            return null;
          }
          
          return {
            id: user.id,
            email: user.email!,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback triggered", { user: user?.email, provider: account?.provider });
      if (account?.provider === "google" && user.email) {
        try {
          console.log("Upserting Google user:", user.email);
          await prisma.user.upsert({
            where: { email: user.email },
            update: { 
              name: user.name || undefined,
              image: user.image || undefined,
            },
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: "USER"
            }
          });
          console.log("Google user upserted successfully");
        } catch (error) {
          console.error("Failed to upsert user:", error);
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      console.log("JWT callback", { tokenEmail: token.email, userId: user?.id, provider: account?.provider });
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      
      if (account?.provider === "google" && token.email) {
        try {
          console.log("Fetching Google user from DB:", token.email);
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true }
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            console.log("Google user found in DB:", dbUser);
          } else {
            console.log("Google user not found in DB");
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log("Session callback", { sessionUser: session.user?.email, tokenId: token.id });
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
  },
};
