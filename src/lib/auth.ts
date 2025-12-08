import type { NextAuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Extend types for our custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  
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
      async authorize(credentials): Promise<User | null> {
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
        } as User & { role: string };
      }
    })
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,

  // Only configure cookies in production to set domain for cross-subdomain auth
  // See openspec/specs/auth.md for documentation
  ...(process.env.VERCEL_ENV === 'production' ? {
    cookies: {
      sessionToken: {
        name: `__Secure-next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax' as const,
          path: '/',
          secure: true,
          domain: '.dog-atlas.com'
        }
      },
      callbackUrl: {
        name: `__Secure-next-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: 'lax' as const,
          path: '/',
          secure: true,
          domain: '.dog-atlas.com'
        }
      },
      csrfToken: {
        name: `__Host-next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax' as const,
          path: '/',
          secure: true
        }
      },
    }
  } : {}),
  
  callbacks: {
    // Called when user signs in - upsert Google users to DB
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
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
      }
      return true;
    },
    
    // Called when JWT is created or updated
    // IMPORTANT: This runs on every request when using JWT strategy
    async jwt({ token, user, account, trigger }): Promise<JWT> {
      // Initial sign-in: user object is available
      if (user) {
        token.id = user.id;
        token.sub = user.id; // sub is standard JWT claim
        token.role = (user as any).role || "USER";
      }
      
      // For Google provider, fetch the database user to get the correct ID
      // This happens on initial sign-in when account is available
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true }
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.sub = dbUser.id;
          token.role = dbUser.role;
        }
      }
      
      return token;
    },
    
    // Called whenever session is checked (getSession, useSession, getServerSession)
    async session({ session, token }) {
      // Transfer token data to session
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
  },
};
