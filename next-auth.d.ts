import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isExtraAuth?: boolean;
      subscriptionStatus?: string;
      emailVerified?: string | null;
    } & DefaultSession["user"];
  }
} 