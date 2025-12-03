import NextAuth, { AuthError } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { verifyPassword } from "@/lib/utils"
import { getUserById } from "@/server/auth"
import { db } from "../../../../prisma/db-init"
import { RolesEnum } from "@/generated/prisma"

class CustomError extends AuthError {
  constructor(name: string, message: string) {
    super();
    this.name = name;
    this.message = message;
  }
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (cred) => {
        try {
          const credEmail = cred?.email as string;
          const credPassword = cred?.password as string;
          const finduser = await db.user.findUnique({
            where: {
              email: credEmail
            }
          });

          if (!finduser) throw new CustomError("Account Not Found", "We couldn't find an account with that email or username!");
          if(finduser.is_active == false) throw new CustomError("Account Blocked!", "Please contact administrator if this is a mistake.");
          // if(finduser.email_verified == null) throw new CustomError("Email Not Verify", "Please confirm your email address verification!");
          
          const verifiedPass = await verifyPassword(credPassword, finduser.password);
          if(!verifiedPass) throw new CustomError("Invalid credentials", "Your email or password is incorrect!");

          return {
            ...finduser,
            name: finduser.fullname
          };
        } catch (err: any) {
          throw new CustomError(err.name, err.message);
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if(account?.provider !== "credentials") return false;
      const exisUser = await getUserById({
        id: user.id ? parseInt(user.id) : 0,
        select: {
          id: true,
          email_verified: true
        }
      });
      if(!exisUser?.email_verified) {
        const findToken = await db.verificationToken.findUnique({
          where: { userId: exisUser?.id},
          select: { token: true }
        });
        if(!findToken) throw new CustomError("Token Not Found", "Please confirm your email address verification!");
        throw new CustomError("Email Not Verify", findToken.token);
      }
      return true;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.email_verified = user.email_verified !== null ? true : false;
      };
      return token;
    },
    session({ session, token }) {
      session.user.name = token.name;
      session.user.id = token.id as string;
      session.user.role = token.role as RolesEnum;
      session.user.email_verified = token.email_verified;
      return session;
    },
  },
  session: {
    strategy: "jwt"
  },
  trustHost: true
});