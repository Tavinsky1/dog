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
    async jwt({ token, user }) {
      console.log("JWT CALLBACK", { token, user });
      if (user) {
        token.sub = user.id;
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    
    async session({ session, token }) {
      console.log("SESSION CALLBACK", { session, token });
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    
    async signIn({ user, account }) {
      console.log("SIGNIN CALLBACK", { user, account });
      if (account?.provider === "google") {
        await prisma.user.upsert({
          where: { email: user.email! },
          update: { 
            name: user.name,
            image: user.image
          },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            role: "USER"
          }
        });
      }
      return true;
    }
  },
  
  pages: {
    signIn: "/login"
  }
};
