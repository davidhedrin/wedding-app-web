import { User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { RolesEnum } from '@/generated/prisma';

declare module "next-auth" {
  interface User {
    role?: RolesEnum;
    email_verified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: RolesEnum;
    email_verified?: Date | null;
  }
}