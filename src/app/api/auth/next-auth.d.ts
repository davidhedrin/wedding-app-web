import { User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
    email_verified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    email_verified: boolean;
  }
}