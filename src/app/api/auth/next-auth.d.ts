import { User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { RolesEnum } from '@prisma/client';

declare module "next-auth" {
  interface User {
    role?: RolesEnum;
    email_verified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: RolesEnum;
    email_verified: boolean;
  }
}