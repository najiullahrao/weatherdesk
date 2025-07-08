// lib/auth.ts
import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (user && user.password && await bcrypt.compare(credentials.password, user.password)) {
            return { id: user.id, email: user.email, name: user.name };
          }
          return null;
        } catch (error) {
          console.error('Database error in authorize:', error);
          return null;
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Guard against build-time execution
      if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
        // Skip database calls during build
        return token;
      }
      
      try {
        // If this is a fresh sign-in, user object will be present
        if (user) {
          token.id = user.id;
          // For fresh sign-in, we might not have all the extended properties
          // So we'll fetch them from the database
          const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
          if (dbUser) {
            token.isExtraAuth = dbUser.isExtraAuth;
            token.subscriptionStatus = dbUser.subscriptionStatus;
            token.emailVerified = dbUser.emailVerified;
          }
        } else {
          // For subsequent requests, fetch fresh data periodically
          const userId = typeof token.id === 'string' ? token.id : undefined;
          if (userId) {
            // Optional: Add timestamp check to avoid fetching on every request
            const now = Date.now();
            const lastRefresh = token.lastRefresh as number || 0;
            const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
            
            if (now - lastRefresh > REFRESH_INTERVAL) {
              const dbUser = await prisma.user.findUnique({ where: { id: userId } });
              if (dbUser) {
                token.id = dbUser.id;
                token.isExtraAuth = dbUser.isExtraAuth;
                token.subscriptionStatus = dbUser.subscriptionStatus;
                token.emailVerified = dbUser.emailVerified;
                token.lastRefresh = now;
              }
            }
          }
        }
      } catch (error) {
        console.error('Database error in JWT callback:', error);
        // Don't fail the authentication, just log the error
      }
      
      return token;
    },
    async session({ session, token }) {
      // Attach user info from token to session
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.isExtraAuth = token.isExtraAuth as boolean | undefined;
        session.user.subscriptionStatus = token.subscriptionStatus as string | undefined;
        session.user.emailVerified = token.emailVerified as string | null | undefined;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          await prisma.user.update({
            where: { id: user.id },
            data: { isExtraAuth: true },
          });
        }
      } catch (error) {
        console.error('Database error in signIn event:', error);
        // Don't fail the sign-in process
      }
    }
  },
};