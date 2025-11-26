import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
          return null;
        }

        const emailOrUsername = credentials.email.toLowerCase().trim();
        
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: emailOrUsername },
                { name: emailOrUsername }
              ]
            }
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          
          if (!isValid) {
            return null;
          }
          
          // Return a complete user object with all required fields
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      // CRITICAL: This runs after successful authentication
      // user is only available on sign in, not on subsequent requests
      if (user) {
        token.sub = user.id; // CRITICAL for session persistence
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role || "USER";
        token.image = user.image;
      }
      
      // For OAuth, ensure we have the user's role from DB
      if (account?.provider === "google" && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { role: true, id: true }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
          token.sub = dbUser.id; // Ensure sub is always set
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Pass token data to client-side session
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).email = token.email as string;
        (session.user as any).name = token.name as string;
        (session.user as any).image = token.image as string;
      }
      return session;
    },
    
    async signIn({ user, account }) {
      // Handle OAuth user creation/update
      if (account?.provider === "google") {
        try {
          await prisma.user.upsert({
            where: { email: user.email! },
            update: { 
              name: user.name,
              image: user.image,
            },
            create: {
              email: user.email!,
              name: user.name,
              image: user.image,
              role: "USER"
            }
          });
          return true;
        } catch (error) {
          console.error("Failed to create/update OAuth user:", error);
          return false;
        }
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Always redirect to the current baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
