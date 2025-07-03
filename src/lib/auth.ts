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
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (user && user.password && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user.id, email: user.email, name: user.name };
        }
        return null;
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      // Always fetch the latest user data from the database
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.isExtraAuth = dbUser.isExtraAuth;
        session.user.subscriptionStatus = dbUser.subscriptionStatus;
        session.user.emailVerified = dbUser.emailVerified;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await prisma.user.update({
          where: { id: user.id },
          data: { isExtraAuth: true },
        });
      }
    }
  },
};
