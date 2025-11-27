import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

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
          return null;
        }

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
      }
    })
  ],
  
  session: {
    strategy: "jwt"
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign in, user object is available
      if (user) {
        token.sub = user.id;
        token.id = user.id;
        token.role = (user as any).role;
        
        // For Google OAuth, fetch role from database
        if (account?.provider === "google" && user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true, role: true }
            });
            if (dbUser) {
              token.id = dbUser.id;
              token.role = dbUser.role;
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
          }
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });
          
          if (existingUser) {
            await prisma.user.update({
              where: { email: user.email! },
              data: { 
                name: user.name,
                image: user.image
              }
            });
          } else {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: "USER"
              }
            });
          }
        } catch (error) {
          console.error("Error upserting user:", error);
          // Still allow sign in even if DB fails
        }
      }
      return true;
    }
  },
  
  pages: {
    signIn: "/login"
  },
  
  debug: process.env.NODE_ENV === "development"
};
